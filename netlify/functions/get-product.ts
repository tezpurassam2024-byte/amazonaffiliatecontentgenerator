import { parseAmazonUrl, SAMPLE_PRODUCTS } from '../../src/lib/amazon';

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

  try {
    const data = JSON.parse(event.body || '{}');
    const url = data.url;

    const parsed = parseAmazonUrl(url);
    if (!parsed.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: parsed.error }),
      };
    }

    // Check if ASIN matches our known sample catalog for rich instant pre-population
    const sampleMatch = SAMPLE_PRODUCTS.find((p) => p.asin === parsed.asin);
    if (sampleMatch) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: true,
          product: {
            ...sampleMatch,
            marketplace: parsed.marketplace || sampleMatch.marketplace,
            amazon_url: parsed.cleanedUrl || sampleMatch.amazon_url,
          },
        }),
      };
    }

    // Server-side product-data provider abstraction:
    // If Amazon PA-API keys are provided in process.env, it can call Amazon PA-API here.
    // If not configured, we return the parsed metadata and instruct the client to confirm/enter specs via the manual fallback form.
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        product: fallbackProduct,
        requiresManualReview: true,
        message:
          'ASIN and marketplace detected. Please confirm or provide product details.',
      }),
    };
  } catch (error: any) {
    console.error('Netlify function get-product error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Error processing product URL',
      }),
    };
  }
};
