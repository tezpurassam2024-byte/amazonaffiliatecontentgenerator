import { GeneratedProductImage } from '../types';

export interface ClientImageRequest {
  imageUrl?: string;
  productName: string;
  brand?: string;
  category?: string;
  style?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9';
  customPrompt?: string;
}

/**
 * Creates a clean studio SVG/Canvas visual directly in the browser.
 * Fully offline-capable, copyright-free, and guaranteed to never fail on network/HTML responses.
 */
export function createClientStudioImage(params: ClientImageRequest): GeneratedProductImage {
  const {
    imageUrl,
    productName,
    brand = 'Brand',
    category = 'Product',
    style = 'clean_studio',
    aspectRatio = '1:1',
  } = params;

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
  let accentColor = '#f97316';
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

  const embeddedImageMarkup = imageUrl
    ? `<image href="${imageUrl}" x="${cx - 250}" y="${cy - 240}" width="500" height="400" preserveAspectRatio="xMidYMid meet" clip-path="url(#productClip)" filter="url(#dropShadow)" />`
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
      <rect x="${cx - 250}" y="${cy - 240}" width="500" height="400" rx="20" />
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
    <ellipse cx="${cx}" cy="${height * 0.72}" rx="380" ry="60" fill="#000000" fill-opacity="0.15" />
    <path d="M${cx - 340} ${height * 0.68} C ${cx - 340} ${height * 0.74}, ${cx + 340} ${height * 0.74}, ${cx + 340} ${height * 0.68} L ${cx + 340} ${height * 0.74} C ${cx + 340} ${height * 0.8}, ${cx - 340} ${height * 0.8}, ${cx - 340} ${height * 0.74} Z" fill="${pedestalColor}" />
    <ellipse cx="${cx}" cy="${height * 0.68}" rx="340" ry="46" fill="${pedestalTop}" />
    <ellipse cx="${cx}" cy="${height * 0.68}" rx="335" ry="42" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" />
  </g>

  <!-- Product Placement -->
  ${embeddedImageMarkup}

  <!-- Studio Header Brand Badge -->
  <g transform="translate(60, 60)">
    <rect width="200" height="40" rx="20" fill="${textColor}" fill-opacity="0.08" />
    <text x="100" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="${textColor}" text-anchor="middle">
      ${safeBrand}
    </text>
  </g>

  <!-- Category Badge -->
  <g transform="translate(${width - 240}, 60)">
    <rect width="180" height="40" rx="20" fill="${accentColor}" fill-opacity="0.15" />
    <text x="90" y="25" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1" fill="${accentColor}" text-anchor="middle">
      COMMERCIAL READY
    </text>
  </g>

  <!-- Product Title & Studio Watermark Free Verification -->
  <g transform="translate(${cx}, ${height - 90})">
    <text x="0" y="-20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="800" fill="${textColor}" text-anchor="middle" letter-spacing="-0.5">
      ${safeName}
    </text>
    <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="${textColor}" fill-opacity="0.5" text-anchor="middle" letter-spacing="1.5">
      100% COPYRIGHT-FREE STUDIO PRODUCT PRESENTATION • AFFILIATE READY
    </text>
  </g>
</svg>`;

  let dataUrl = '';
  try {
    dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  } catch (e) {
    dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  return {
    id: `img_${Date.now()}`,
    url: dataUrl,
    prompt: `Professional ${style.replace('_', ' ')} studio rendition of ${productName}`,
    style,
    created_at: new Date().toISOString(),
    source_image_url: imageUrl,
  };
}

/**
 * Universal safe image generator: tries server-side backend API first,
 * and if any HTML or network error occurs, seamlessly produces high-fidelity client studio visual.
 */
export async function requestProductImage(params: ClientImageRequest): Promise<GeneratedProductImage> {
  const endpoints = ['/.netlify/functions/generate-product-image', '/api/generate-product-image'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Returned HTML (e.g. index.html SPA redirect) - skip and try next or fallback
        continue;
      }

      const result = await response.json();
      if (response.ok && result.success && result.image) {
        return result.image;
      }
    } catch (err) {
      console.warn(`Endpoint ${endpoint} failed, trying fallback:`, err);
    }
  }

  // Graceful client fallback: generate directly in browser
  return createClientStudioImage(params);
}
