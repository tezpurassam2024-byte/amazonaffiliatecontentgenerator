import { scrapeAndExtractAmazonProduct } from '../../src/lib/scraper';
import { extractProductAutonomously } from '../../src/lib/autonomousExtractor';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
}

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let url = '';
  try {
    const data = JSON.parse(event.body || '{}');
    url = data.url || '';

    if (!url) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Amazon product URL is required' }),
      };
    }

    const extractionResult = await scrapeAndExtractAmazonProduct(url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        product: extractionResult.product,
        specifications: extractionResult.product.master_specifications || extractionResult.product.specifications,
        source: extractionResult.source,
        message: extractionResult.message,
        master_engine: extractionResult.product.master_engine_response,
      }),
    };
  } catch (error: any) {
    console.warn('Netlify get-product live attempt failed, invoking Autonomous Master Extractor:', error?.message);

    try {
      if (url) {
        const autonomous = extractProductAutonomously(url);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            success: true,
            product: autonomous.product,
            specifications: autonomous.specifications,
            source: 'autonomous',
            message: 'Extracted successfully by Autonomous Master Engine.',
            master_engine: autonomous.master_engine,
          }),
        };
      }
    } catch (fallbackErr: any) {
      console.error('Autonomous fallback error:', fallbackErr);
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'An error occurred while extracting the Amazon product.',
      }),
    };
  }
};
