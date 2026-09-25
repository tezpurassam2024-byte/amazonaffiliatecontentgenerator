import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateAffiliateContent,
  refineContentSection,
  generateSingleSection,
} from './src/lib/gemini';
import { parseAmazonUrl, SAMPLE_PRODUCTS } from './src/lib/amazon';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Common Handler for Product URL resolving
const handleGetProduct = (req: Request, res: Response) => {
  const { url } = req.body;
  const parsed = parseAmazonUrl(url);

  if (!parsed.isValid) {
    return res.status(400).json({ error: parsed.error });
  }

  const sampleMatch = SAMPLE_PRODUCTS.find((p) => p.asin === parsed.asin);
  if (sampleMatch) {
    return res.json({
      success: true,
      product: {
        ...sampleMatch,
        marketplace: parsed.marketplace || sampleMatch.marketplace,
        amazon_url: parsed.cleanedUrl || sampleMatch.amazon_url,
      },
    });
  }

  // Fallback representation for new URLs
  const fallbackProduct = {
    id: `prod_${Date.now()}`,
    asin: parsed.asin || 'UNKNOWN',
    marketplace: parsed.marketplace || 'com',
    product_name: '',
    brand: '',
    category: 'General',
    amazon_url: parsed.cleanedUrl || url,
    key_features: [],
    specifications: [],
    source: 'url',
  };

  return res.json({
    success: true,
    product: fallbackProduct,
    requiresManualReview: true,
    message: 'Amazon marketplace and ASIN detected. Please enter or confirm product specifications.',
  });
};

// Common Handler for Content Generation
const handleGenerateContent = async (req: Request, res: Response) => {
  try {
    const { product, options, extraComparisonProducts } = req.body;

    if (!product || !product.product_name) {
      return res.status(400).json({ error: 'Valid product name and details are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY is not set in the server environment. Please configure it in your secrets/environment variables.',
      });
    }

    const generated = await generateAffiliateContent(
      product,
      options,
      extraComparisonProducts || []
    );

    return res.json({ success: true, data: generated });
  } catch (error: any) {
    console.error('Content generation error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating content with Gemini.',
    });
  }
};

// Common Handler for Refining Content
const handleRefineContent = async (req: Request, res: Response) => {
  try {
    const { sectionText, action, productName, writingStyle, keywords } = req.body;

    if (!sectionText) {
      return res.status(400).json({ error: 'No section text provided to refine.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is missing.',
      });
    }

    const refinedText = await refineContentSection(
      sectionText,
      action || 'improve',
      productName || 'Amazon Product',
      writingStyle || 'Professional',
      keywords || []
    );

    return res.json({ success: true, refinedText });
  } catch (error: any) {
    console.error('Refine error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to refine content.',
    });
  }
};

// Common Handler for Independent Section Regeneration
const handleRegenerateSection = async (req: Request, res: Response) => {
  try {
    const { section, product, options, extraComparisonProducts } = req.body;

    if (!section || !product) {
      return res.status(400).json({ error: 'Section name and product data are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
    }

    const sectionData = await generateSingleSection(
      section,
      product,
      options,
      extraComparisonProducts || []
    );

    return res.json({ success: true, sectionData });
  } catch (error: any) {
    console.error('Section regeneration error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to regenerate section.',
    });
  }
};

// Support both standard Netlify Functions path AND standard Express /api path!
app.post('/.netlify/functions/get-product', handleGetProduct);
app.post('/api/get-product', handleGetProduct);

app.post('/.netlify/functions/generate-content', handleGenerateContent);
app.post('/api/generate-content', handleGenerateContent);

app.post('/.netlify/functions/refine-content', handleRefineContent);
app.post('/api/refine-content', handleRefineContent);

app.post('/.netlify/functions/regenerate-section', handleRegenerateSection);
app.post('/api/regenerate-section', handleRegenerateSection);

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (dev: ${isDev})`);
  });
}

startServer();
