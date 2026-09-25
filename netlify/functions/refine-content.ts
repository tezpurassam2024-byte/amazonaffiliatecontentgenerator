import { refineContentSection } from '../../src/lib/gemini';

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
    const { sectionText, action, productName, writingStyle, keywords } = data;

    if (!sectionText) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing section text' }),
      };
    }

    const refinedText = await refineContentSection(
      sectionText,
      action || 'improve',
      productName || 'Amazon Product',
      writingStyle || 'Professional',
      keywords || []
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, refinedText }),
    };
  } catch (error: any) {
    console.error('Netlify function refine-content error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to refine content',
      }),
    };
  }
};
