// Backward-compatibility router for any legacy calls to /.netlify/functions/:splat
import { onRequestPost as handleGetProduct } from '../api/get-product';
import { onRequestPost as handleGenerateContent } from '../api/generate-content';
import { onRequestPost as handleGenerateProductImage } from '../api/generate-product-image';
import { onRequestPost as handleRefineContent } from '../api/refine-content';
import { onRequestPost as handleRegenerateSection } from '../api/regenerate-section';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestPost = async (context: any) => {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/^\/\.netlify\/functions\//, '');

  switch (path) {
    case 'get-product':
      return handleGetProduct(context);
    case 'generate-content':
      return handleGenerateContent(context);
    case 'generate-product-image':
      return handleGenerateProductImage(context);
    case 'refine-content':
      return handleRefineContent(context);
    case 'regenerate-section':
      return handleRegenerateSection(context);
    default:
      return new Response(JSON.stringify({ error: `Route ${path} not found` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
  }
};
