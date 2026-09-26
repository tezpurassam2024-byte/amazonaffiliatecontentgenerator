import { scrapeAndExtractAmazonProduct } from '../../src/lib/scraper';

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
        source: extractionResult.source,
        message: extractionResult.message,
      }),
    };
  } catch (error: any) {
    console.error('Netlify get-product error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'An error occurred while scraping the Amazon product.',
      }),
    };
  }
};
