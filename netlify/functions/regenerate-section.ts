import { generateSingleSection } from '../../src/lib/gemini';

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
    const { section, product, options, extraComparisonProducts } = data;

    if (!section || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing section name or product data' }),
      };
    }

    const sectionData = await generateSingleSection(
      section,
      product,
      options,
      extraComparisonProducts || []
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, sectionData }),
    };
  } catch (error: any) {
    console.error('Netlify function regenerate-section error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to regenerate section',
      }),
    };
  }
};
