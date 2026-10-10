import { scrapeAndExtractAmazonProduct } from '../../src/lib/scraper';
import { extractProductAutonomously } from '../../src/lib/autonomousExtractor';

interface Env {
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  API_KEY?: string;
  [key: string]: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  // Sync Cloudflare env with global environment for helper functions
  if (context.env) {
    if (typeof process !== 'undefined' && process.env) {
      if (context.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = context.env.GEMINI_API_KEY;
      }
      if (context.env.GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY) {
        process.env.GOOGLE_API_KEY = context.env.GOOGLE_API_KEY;
      }
    }
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (context.env.GEMINI_API_KEY) g.GEMINI_API_KEY = context.env.GEMINI_API_KEY;
      if (context.env.GOOGLE_API_KEY) g.GOOGLE_API_KEY = context.env.GOOGLE_API_KEY;
    }
  }

  let url = '';
  try {
    const data: any = await context.request.json().catch(() => ({}));
    url = data.url || '';

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Amazon product URL is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const extractionResult = await scrapeAndExtractAmazonProduct(url);

    return new Response(
      JSON.stringify({
        success: true,
        status: 'success',
        product: extractionResult.product,
        specifications:
          extractionResult.product.master_specifications ||
          extractionResult.product.specifications,
        source: extractionResult.source,
        message: extractionResult.message,
        master_engine: extractionResult.product.master_engine_response,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.warn('Live scraping failed on Cloudflare Pages, falling back to autonomous extractor:', err?.message);
    try {
      if (url) {
        const autonomous = extractProductAutonomously(url);
        return new Response(
          JSON.stringify({
            success: true,
            status: 'success',
            product: autonomous.product,
            specifications: autonomous.specifications,
            source: 'autonomous',
            message: 'Product specifications extracted successfully by Autonomous Master Extractor.',
            master_engine: autonomous.master_engine,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (fallbackErr: any) {
      console.error('Autonomous extraction fallback error:', fallbackErr);
    }

    return new Response(
      JSON.stringify({
        error: err?.message || 'Failed to extract product information from URL',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
