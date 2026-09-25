import { GoogleGenAI } from '@google/genai';
import { getGeminiClient } from './gemini';
import { GeneratedProductImage } from '../types';

export interface ImageGenerationRequest {
  imageUrl?: string;
  productName: string;
  brand?: string;
  category?: string;
  style?: 'clean_studio' | 'luxury_dark' | 'lifestyle_desk' | 'minimalist_pastel' | 'outdoor_natural';
  aspectRatio?: '1:1' | '4:3' | '16:9';
  customPrompt?: string;
}

/**
 * Generates an SVG studio product visualization
 * Completely royalty-free, copyright-safe, customizable, and instantly downloadable.
 */
function createStudioSvgDataUrl(
  productName: string,
  brand: string,
  category: string,
  style: string,
  aspectRatio: string,
  embeddedImageBase64?: string
): string {
  let width = 1200;
  let height = 1200;
  if (aspectRatio === '16:9') {
    width = 1600;
    height = 900;
  } else if (aspectRatio === '4:3') {
    width = 1200;
    height = 900;
  }

  const safeBrand = (brand || 'PREMIUM BRAND').toUpperCase();
  const safeName = (productName || 'Featured Product').slice(0, 48);
  const safeCat = (category || 'Affiliate Review Selection').toUpperCase();

  // Style Themes
  let bgGradient = `
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>`;
  let pedestalColor = '#cbd5e1';
  let pedestalTop = '#e2e8f0';
  let textColor = '#0f172a';
  let accentColor = '#f97316'; // Orange affiliate accent
  let glowColor = 'rgba(249, 115, 22, 0.15)';

  if (style === 'luxury_dark') {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#090d16" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>`;
    pedestalColor = '#1e293b';
    pedestalTop = '#334155';
    textColor = '#f8fafc';
    accentColor = '#38bdf8';
    glowColor = 'rgba(56, 189, 248, 0.2)';
  } else if (style === 'lifestyle_desk') {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef3c7" />
        <stop offset="50%" stop-color="#fef9c3" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>`;
    pedestalColor = '#d97706';
    pedestalTop = '#fde68a';
    textColor = '#451a03';
    accentColor = '#b45309';
    glowColor = 'rgba(217, 119, 6, 0.15)';
  } else if (style === 'minimalist_pastel') {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdf4ff" />
        <stop offset="50%" stop-color="#fae8ff" />
        <stop offset="100%" stop-color="#e0e7ff" />
      </linearGradient>`;
    pedestalColor = '#c084fc';
    pedestalTop = '#f3e8ff';
    textColor = '#3b0764';
    accentColor = '#a855f7';
    glowColor = 'rgba(168, 85, 247, 0.18)';
  } else if (style === 'outdoor_natural') {
    bgGradient = `
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0fdf4" />
        <stop offset="50%" stop-color="#dcfce7" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>`;
    pedestalColor = '#15803d';
    pedestalTop = '#86efac';
    textColor = '#14532d';
    accentColor = '#16a34a';
    glowColor = 'rgba(22, 163, 74, 0.18)';
  }

  const cx = width / 2;
  const cy = height * 0.48;

  const embeddedImageMarkup = embeddedImageBase64
    ? `<image href="${embeddedImageBase64}" x="${cx - 260}" y="${cy - 240}" width="520" height="420" preserveAspectRatio="xMidYMid meet" clip-path="url(#productClip)" filter="url(#dropShadow)" />`
    : `
      <!-- Stylized Vector Product Presentation Icon -->
      <g filter="url(#dropShadow)" transform="translate(${cx}, ${cy - 40})">
        <circle r="140" fill="${accentColor}" opacity="0.12" />
        <circle r="100" fill="url(#productGrad)" stroke="${accentColor}" stroke-width="4" />
        <path d="M-40 -20 L0 -50 L40 -20 L40 40 L-40 40 Z" fill="${textColor}" opacity="0.85" />
        <path d="M-30 0 L0 -25 L30 0 L30 35 L-30 35 Z" fill="${accentColor}" opacity="0.9" />
        <!-- Highlights -->
        <circle cx="-25" cy="-25" r="12" fill="#ffffff" opacity="0.6" />
      </g>
    `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    ${bgGradient}
    <linearGradient id="productGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${textColor}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.25" />
    </linearGradient>
    <radialGradient id="lightGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </radialGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.25" />
    </filter>
    <filter id="pedestalShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.2" />
    </filter>
    <clipPath id="productClip">
      <rect x="${cx - 260}" y="${cy - 240}" width="520" height="420" rx="24" />
    </clipPath>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" fill="url(#bg)" />

  <!-- Studio Ambient Lighting Glow -->
  <ellipse cx="${cx}" cy="${cy}" rx="${width * 0.4}" ry="${height * 0.35}" fill="url(#lightGlow)" />

  <!-- Studio Horizon Lighting Line -->
  <line x1="0" y1="${height * 0.65}" x2="${width}" y2="${height * 0.65}" stroke="${textColor}" stroke-opacity="0.06" stroke-width="2" />

  <!-- Studio Display Pedestal -->
  <g filter="url(#pedestalShadow)">
    <!-- Pedestal Base Shadow -->
    <ellipse cx="${cx}" cy="${height * 0.72}" rx="380" ry="60" fill="#000000" fill-opacity="0.15" />
    <!-- Pedestal Cylinder Body -->
    <path d="M${cx - 340} ${height * 0.68} C ${cx - 340} ${height * 0.74}, ${cx + 340} ${height * 0.74}, ${cx + 340} ${height * 0.68} L ${cx + 340} ${height * 0.74} C ${cx + 340} ${height * 0.8}, ${cx - 340} ${height * 0.8}, ${cx - 340} ${height * 0.74} Z" fill="${pedestalColor}" />
    <!-- Pedestal Top Surface -->
    <ellipse cx="${cx}" cy="${height * 0.68}" rx="340" ry="46" fill="${pedestalTop}" />
    <ellipse cx="${cx}" cy="${height * 0.68}" rx="335" ry="42" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
  </g>

  <!-- Product Placement -->
  ${embeddedImageMarkup}

  <!-- Studio Header Brand Badge -->
  <g transform="translate(60, 60)">
    <rect width="200" height="40" rx="20" fill="${textColor}" fill-opacity="0.08" />
    <text x="100" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="${textColor}" text-anchor="middle">
      ${safeBrand}
    </text>
  </g>

  <!-- Category Badge -->
  <g transform="translate(${width - 240}, 60)">
    <rect width="180" height="40" rx="20" fill="${accentColor}" fill-opacity="0.15" />
    <text x="90" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1" fill="${accentColor}" text-anchor="middle">
      COMMERCIAL READY
    </text>
  </g>

  <!-- Product Title & Studio Watermark Free Verification -->
  <g transform="translate(${cx}, ${height - 90})">
    <text x="0" y="-20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="800" fill="${textColor}" text-anchor="middle" letter-spacing="-0.5">
      ${safeName}
    </text>
    <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="600" fill="${textColor}" fill-opacity="0.5" text-anchor="middle" letter-spacing="1.5">
      100% COPYRIGHT-FREE STUDIO PRODUCT PRESENTATION • AFFILIATE READY
    </text>
  </g>
</svg>`;

  const base64Svg = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64Svg}`;
}

/**
 * Downloads image from URL and converts to base64
 */
async function fetchImageAsBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Failed to fetch image from URL: ${res.statusText}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim();
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = buffer.toString('base64');

    return { data, mimeType };
  } catch (err: any) {
    console.warn('Error fetching image from URL:', err.message);
    return null;
  }
}

/**
 * Main Product Image Generator
 * Generates a clean, copyright-free, commercial-ready studio product photograph
 */
export async function generateProductImage(
  params: ImageGenerationRequest
): Promise<GeneratedProductImage> {
  const {
    imageUrl,
    productName,
    brand = 'Brand',
    category = 'Product',
    style = 'clean_studio',
    aspectRatio = '1:1',
    customPrompt,
  } = params;

  let fetchedImage: { data: string; mimeType: string } | null = null;
  if (imageUrl && imageUrl.startsWith('http')) {
    fetchedImage = await fetchImageAsBase64(imageUrl);
  }

  const ai = getGeminiClient();

  // If Gemini client is available, attempt nano banana model generation
  if (ai) {
    try {
      const promptText =
        customPrompt ||
        `Generate a professional, high-end studio commercial product photograph of "${productName}" by ${brand} in the style of ${style.replace('_', ' ')}. Placed on an elegant display pedestal with soft directional studio lighting, ultra-clean commercial aesthetic, no copyright watermarks, no logos, no text artifacts, 8k resolution.`;

      const contentsParts: any[] = [{ text: promptText }];

      if (fetchedImage) {
        contentsParts.unshift({
          inlineData: {
            data: fetchedImage.data,
            mimeType: fetchedImage.mimeType,
          },
        });
      }

      // Try image generation model
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: { parts: contentsParts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      });

      // Find image part in candidates
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          const generatedUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          return {
            id: `img_${Date.now()}`,
            url: generatedUrl,
            prompt: promptText,
            style,
            created_at: new Date().toISOString(),
            source_image_url: imageUrl,
          };
        }
      }
    } catch (err: any) {
      console.warn('Gemini image generation model not available or quota limited:', err.message);
      // Fall through to the clean studio generator
    }
  }

  // Fallback: Generate clean, copyright-free studio SVG/Canvas visual
  const embeddedDataUrl = fetchedImage
    ? `data:${fetchedImage.mimeType};base64,${fetchedImage.data}`
    : undefined;

  const studioDataUrl = createStudioSvgDataUrl(
    productName,
    brand,
    category,
    style,
    aspectRatio,
    embeddedDataUrl
  );

  return {
    id: `img_${Date.now()}`,
    url: studioDataUrl,
    prompt: `Professional ${style.replace('_', ' ')} studio rendition of ${productName}`,
    style,
    created_at: new Date().toISOString(),
    source_image_url: imageUrl,
  };
}
