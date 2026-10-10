import { generateAffiliateContent } from '../../src/lib/gemini';
import { AmazonProduct, ContentGenerationOptions } from '../../src/types';

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

  try {
    const data: any = await context.request.json().catch(() => ({}));
    const product: AmazonProduct = data.product;
    const options: ContentGenerationOptions = data.options;
    const extraComparisonProducts = data.extraComparisonProducts || [];

    if (!product || !product.product_name) {
      return new Response(
        JSON.stringify({ error: 'Missing valid product data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const generatedContent = await generateAffiliateContent(
      product,
      options,
      extraComparisonProducts
    );

    return new Response(
      JSON.stringify({ success: true, data: generatedContent }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Cloudflare Pages generate-content error:', error);
    return new Response(
      JSON.stringify({
        error: error?.message || 'Failed to generate content with Gemini',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
