interface Env {
  GEMINI_API_KEY?: string;
  GOOGLE_API_KEY?: string;
  API_KEY?: string;
  [key: string]: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const hasKey = Boolean(
    context.env?.GEMINI_API_KEY ||
    context.env?.GOOGLE_API_KEY ||
    context.env?.API_KEY ||
    (typeof process !== 'undefined' && (process.env?.GEMINI_API_KEY || process.env?.GOOGLE_API_KEY))
  );

  return new Response(
    JSON.stringify({
      status: 'ok',
      platform: 'cloudflare-pages',
      timestamp: new Date().toISOString(),
      geminiConfigured: hasKey,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
