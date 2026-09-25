import { generateAffiliateContent } from '../../src/lib/gemini';
import { AmazonProduct, ContentGenerationOptions } from '../../src/types';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
}

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const product: AmazonProduct = data.product;
    const options: ContentGenerationOptions = data.options;
    const extraComparisonProducts = data.extraComparisonProducts || [];

    if (!product || !product.product_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing valid product data' }),
      };
    }

    const generatedContent = await generateAffiliateContent(
      product,
      options,
      extraComparisonProducts
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, data: generatedContent }),
    };
  } catch (error: any) {
    console.error('Netlify function generate-content error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: error.message || 'Failed to generate affiliate content',
      }),
    };
  }
};
