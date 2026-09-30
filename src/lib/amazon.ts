import { AmazonMarketplace, AmazonProduct, MarketplaceId } from '../types';

export const SUPPORTED_MARKETPLACES: Record<MarketplaceId, AmazonMarketplace> = {
  com: {
    id: 'com',
    name: 'Amazon US',
    domain: 'amazon.com',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
  },
  in: {
    id: 'in',
    name: 'Amazon India',
    domain: 'amazon.in',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
  },
  'co.uk': {
    id: 'co.uk',
    name: 'Amazon UK',
    domain: 'amazon.co.uk',
    country: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
  },
  ca: {
    id: 'ca',
    name: 'Amazon Canada',
    domain: 'amazon.ca',
    country: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    flag: '🇨🇦',
  },
  'com.au': {
    id: 'com.au',
    name: 'Amazon Australia',
    domain: 'amazon.com.au',
    country: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
  },
  de: {
    id: 'de',
    name: 'Amazon Germany',
    domain: 'amazon.de',
    country: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
  },
  fr: {
    id: 'fr',
    name: 'Amazon France',
    domain: 'amazon.fr',
    country: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇷',
  },
  it: {
    id: 'it',
    name: 'Amazon Italy',
    domain: 'amazon.it',
    country: 'Italy',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇮🇹',
  },
  es: {
    id: 'es',
    name: 'Amazon Spain',
    domain: 'amazon.es',
    country: 'Spain',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇸',
  },
  'co.jp': {
    id: 'co.jp',
    name: 'Amazon Japan',
    domain: 'amazon.co.jp',
    country: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    flag: '🇯🇵',
  },
};

/**
 * Extracts ASIN and Marketplace from an Amazon URL
 */
export function parseAmazonUrl(rawUrl: string): {
  isValid: boolean;
  asin?: string;
  marketplace?: MarketplaceId;
  cleanedUrl?: string;
  error?: string;
} {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter an Amazon product URL.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please provide a full web URL.' };
  }

  const hostname = parsed.hostname.toLowerCase().replace('www.', '');

  // Detect marketplace
  let matchedMarketplace: MarketplaceId | undefined;
  for (const [key, meta] of Object.entries(SUPPORTED_MARKETPLACES)) {
    if (hostname === meta.domain || hostname.endsWith(`.${meta.domain}`)) {
      matchedMarketplace = key as MarketplaceId;
      break;
    }
  }

  // Handle shortened or alternative domains
  if (!matchedMarketplace) {
    if (hostname.includes('amazon.in')) matchedMarketplace = 'in';
    else if (hostname.includes('amazon.co.uk')) matchedMarketplace = 'co.uk';
    else if (hostname.includes('amazon.ca')) matchedMarketplace = 'ca';
    else if (hostname.includes('amazon.com.au')) matchedMarketplace = 'com.au';
    else if (hostname.includes('amazon.de')) matchedMarketplace = 'de';
    else if (hostname.includes('amazon.fr')) matchedMarketplace = 'fr';
    else if (hostname.includes('amazon.it')) matchedMarketplace = 'it';
    else if (hostname.includes('amazon.es')) matchedMarketplace = 'es';
    else if (hostname.includes('amazon.co.jp')) matchedMarketplace = 'co.jp';
    else if (hostname.includes('amazon.com')) matchedMarketplace = 'com';
    else if (hostname === 'amzn.to' || hostname === 'amzn.eu' || hostname === 'a.co') {
      matchedMarketplace = 'com'; // default for short links
    } else {
      return {
        isValid: false,
        error: `Unsupported domain '${hostname}'. Supported marketplaces: ${Object.values(
          SUPPORTED_MARKETPLACES
        )
          .map((m) => m.domain)
          .join(', ')}`,
      };
    }
  }

  // Extract ASIN (10 character alphanumeric, typically starts with B0... or digits for books)
  // Common patterns:
  // /dp/B08N5WRWNW
  // /gp/product/B08N5WRWNW
  // /exec/obidos/ASIN/B08N5WRWNW
  // /product-reviews/B08N5WRWNW
  const pathname = parsed.pathname;
  const asinRegexes = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/d\/([A-Z0-9]{10})/i,
    /\/o\/ASIN\/([A-Z0-9]{10})/i,
  ];

  let asin: string | undefined;
  for (const regex of asinRegexes) {
    const match = pathname.match(regex);
    if (match && match[1]) {
      asin = match[1].toUpperCase();
      break;
    }
  }

  // Also check query param ?asin=xxx or /dp/B0XXXXXX in search
  if (!asin) {
    const searchAsin = parsed.searchParams.get('asin') || parsed.searchParams.get('ASIN');
    if (searchAsin && /^[A-Z0-9]{10}$/i.test(searchAsin)) {
      asin = searchAsin.toUpperCase();
    }
  }

  // Fallback direct 10-char ASIN check in pathname
  if (!asin) {
    const directMatch = pathname.match(/(?:^|\/)([B0-9][A-Z0-9]{9})(?:[\/?#]|$)/i);
    if (directMatch && directMatch[1]) {
      asin = directMatch[1].toUpperCase();
    }
  }

  const domain = matchedMarketplace
    ? SUPPORTED_MARKETPLACES[matchedMarketplace].domain
    : 'amazon.com';
  const cleanedUrl = asin ? `https://www.${domain}/dp/${asin}` : trimmed;

  return {
    isValid: true,
    asin,
    marketplace: matchedMarketplace,
    cleanedUrl,
  };
}

/**
 * Extracts slug text from Amazon URL path (e.g. /Sony-WH-1000XM5-Canceling-Headphones/dp/...)
 */
export function extractTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const dpIndex = parts.findIndex((p) => p.toLowerCase() === 'dp' || p.toLowerCase() === 'product');
    if (dpIndex > 0) {
      const slug = parts[dpIndex - 1];
      if (slug && !slug.toLowerCase().includes('amazon') && slug.length > 3) {
        return slug.replace(/-/g, ' ').trim();
      }
    }
  } catch {
    // Ignore URL parse error
  }
  return '';
}

/**
 * Appends or updates Amazon Associate Tag securely
 */
export function buildAffiliateUrl(
  productUrl: string,
  asin?: string,
  marketplace: MarketplaceId = 'com',
  tag?: string
): string {
  const domain = SUPPORTED_MARKETPLACES[marketplace]?.domain || 'amazon.com';
  const cleanTag = tag?.trim();

  let targetUrl = productUrl;
  if (asin) {
    targetUrl = `https://www.${domain}/dp/${asin}`;
  }

  try {
    const urlObj = new URL(targetUrl);
    if (cleanTag) {
      urlObj.searchParams.set('tag', cleanTag);
      urlObj.searchParams.set('linkCode', 'll1');
    }
    return urlObj.toString();
  } catch {
    if (cleanTag) {
      const sep = targetUrl.includes('?') ? '&' : '?';
      return `${targetUrl}${sep}tag=${encodeURIComponent(cleanTag)}`;
    }
    return targetUrl;
  }
}

/**
 * High quality curated demo catalog for instant one-click testing without API keys
 */
export const SAMPLE_PRODUCTS: AmazonProduct[] = [
  {
    id: 'demo-sony-wh1000xm5',
    asin: 'B09XS7JWHH',
    marketplace: 'com',
    product_name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'Electronics & Audio',
    price: '$398.00',
    rating: 4.6,
    review_count: 14820,
    image_url:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    amazon_url: 'https://www.amazon.com/dp/B09XS7JWHH',
    key_features: [
      'Two processors and 8 microphones for industry-leading noise cancellation',
      'Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback)',
      'Ultra-comfortable, lightweight design with soft fit synthetic leather',
      'Multipoint connection allows switching between two Bluetooth devices simultaneously',
      'Precise Voice Pickup technology with 4 beamforming microphones for crystal clear hands-free calls',
      'Speak-to-Chat and Quick Attention mode to automatically pause music when speaking',
    ],
    specifications: [
      { name: 'Headphone Type', value: 'Over-Ear, Closed-Dynamic' },
      { name: 'Driver Unit', value: '30mm Carbon Fiber Composite' },
      { name: 'Frequency Response', value: '4 Hz - 40,000 Hz' },
      { name: 'Weight', value: '250 grams (8.8 oz)' },
      { name: 'Bluetooth Version', value: 'Bluetooth 5.2 (LDAC, AAC, SBC)' },
      { name: 'Battery Life', value: 'Up to 30 hrs (NC ON), 40 hrs (NC OFF)' },
      { name: 'Charging Port', value: 'USB Type-C with USB-PD fast charge' },
      { name: 'Warranty', value: '1 Year Limited Manufacturer Warranty' },
    ],
    description:
      'The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Powered by the Integrated Processor V1 and HD Noise Canceling Processor QN1, they deliver unprecedented noise reduction across mid and high frequencies. High-Resolution Audio is supported wired and wirelessly via LDAC.',
    source: 'url',
  },
  {
    id: 'demo-macbook-air-m3',
    asin: 'B0CX23G144',
    marketplace: 'com',
    product_name: 'Apple 2024 MacBook Air 13-inch Laptop with M3 chip',
    brand: 'Apple',
    model: 'MacBook Air 13" (M3)',
    category: 'Computers & Laptops',
    price: '$1,099.00',
    rating: 4.8,
    review_count: 4210,
    image_url:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    amazon_url: 'https://www.amazon.com/dp/B0CX23G144',
    key_features: [
      'Supercharged by the 3-nanometer M3 chip with an 8-core CPU and 10-core GPU',
      'Up to 18 hours of battery life to power through your day without charging',
      'Striking 13.6-inch Liquid Retina display with 500 nits brightness and P3 wide color',
      'Fanless, completely silent design encased in durable recycled aluminum',
      'Supports up to two external displays when laptop lid is closed',
      '1080p FaceTime HD camera, three-mic array, and Spatial Audio sound system',
    ],
    specifications: [
      {
        name: 'Processor',
        value: 'Apple M3 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 4.05GHz, 24MB Unified Cache || NPU: 16-Core Neural Engine, up to 38 TOPS',
      },
      {
        name: 'Display',
        value: '13.6" WQXGA Liquid Retina IPS (2560x1664) | 500Nits Typical Brightness, 500Nits Peak Brightness | 100% DCI-P3 Wide Color | DisplayHDR / Dolby Vision Support | True Tone Technology | Anti Glare Anti-Reflective | TUV Low Blue Light Certified',
      },
      {
        name: 'Memory and Storage',
        value: '16GB Soldered Unified Memory LPDDR5-6400 (100GB/s bandwidth), Unified Memory Architecture, not upgradable | 512GB SSD PCIe 4.0x4 NVMe, High-Speed Apple Unified Flash Storage',
      },
      {
        name: 'OS and Software',
        value: 'macOS Sonoma (pre-installed, lifetime free OS upgrades) | Apple Intelligence Ready + iWork Suite (Pages, Numbers, Keynote)',
      },
      {
        name: 'Design',
        value: '4 side narrow bezel with 5mm uniform borders | 1.13 cm Ultra Thin & 1.24 kg Light | Backlight Keyboard with Touch ID | Case Material: Aluminium (Top), Aluminium (Bottom)',
      },
      {
        name: 'Graphics',
        value: 'Integrated Apple 10-Core GPU | Hardware-Accelerated Ray Tracing, Dynamic Caching, Mesh Shading',
      },
      {
        name: 'Battery and Power',
        value: '66.5Wh Integrated Lithium-Polymer Battery | MagSafe 3 Fast Charging with 35W/70W Adapter (Up to 18 Hours Apple TV playback, 15 Hours Wireless Web)',
      },
      {
        name: 'Connectivity and Audio',
        value: 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3 | MagSafe 3, 2x Thunderbolt 4 / USB 4 (40Gbps), 3.5mm Headphone Jack with High-Impedance Support | Six-speaker sound system with force-cancelling woofers, Spatial Audio, 3-mic array',
      },
    ],
    description:
      'The M3 chip brings even greater capabilities to the super-portable 13-inch MacBook Air. Built for Apple Intelligence, it delivers up to 18 hours of battery life and handles demanding workloads with remarkable speed and silent fanless thermal efficiency.',
    source: 'url',
  },
  {
    id: 'demo-intel-core-ultra-7',
    asin: 'B0DFV12345',
    marketplace: 'com',
    product_name: 'Lenovo Slim 7i Intel Core Ultra 7 256V 14" OLED Laptop',
    brand: 'Lenovo',
    model: 'Slim 7i Gen 9',
    category: 'Computers & Laptops',
    price: '$1,249.99',
    rating: 4.8,
    review_count: 1850,
    image_url:
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    amazon_url: 'https://www.amazon.com/dp/B0DFV12345',
    key_features: [
      'Intel Core Ultra 7 256V Lunar Lake processor with 47 TOPS Integrated NPU',
      'Stunning 14" WUXGA OLED display with 100% DCI-P3 and DisplayHDR True Black 500',
      '16GB soldered high-speed LPDDR5x-8533 memory and 512GB PCIe 4.0 SSD',
      'Ultra thin 1.39 cm profile and 1.19 kg lightweight premium all-aluminum chassis',
      'Preloaded with Windows 11 Home and Microsoft Office 2024 lifetime license',
    ],
    specifications: [
      {
        name: 'Processor',
        value: 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 47 TOPS',
      },
      {
        name: 'Display',
        value: '14" WUXGA OLED (1920x1200) | 400Nits Typical Brightness, 600Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black 500 | X-Rite | Dolby Vision | Anti Glare | TUV Low Blue Light Certified',
      },
      {
        name: 'Memory and Storage',
        value: '16GB Soldered LPDDR5x-8533, Mop memory Max Memory Max Memory 16GB soldered memory, not upgradable | 512GB SSD M.2 2242 PCIe 4.0x4 NVMe, Max Storage Support One drive, up to 1TB M.2 2242 SSD',
      },
      {
        name: 'OS and Software',
        value: 'Windows 11 Home Single Language, English | Microsoft 365 Basic + Office Home 2024',
      },
      {
        name: 'Design',
        value: '4 side narrow bezel | 1.39 cm Ultra Thin & 1.19 kg Light | Backlight Keyboard | Case Material: Aluminium (Top), Aluminium (Bottom)',
      },
      {
        name: 'Graphics',
        value: 'Integrated Intel Arc 140V Graphics | DirectX 12 Ultimate, Ray Tracing, Intel XeSS AI Super Sampling',
      },
      {
        name: 'Battery and Power',
        value: '70Wh Integrated 4-Cell Li-Polymer Battery | Rapid Charge Boost (Up to 18 Hours Video Playback, 15 min charge for 3 hours use)',
      },
      {
        name: 'Connectivity and Audio',
        value: 'Wi-Fi 7 (802.11be) 2x2 + Bluetooth 5.4 | 2x Thunderbolt 4 / USB4 40Gbps, 1x USB-A 3.2 Gen 1, 1x HDMI 2.1, 3.5mm Headphone Jack | Stereo Speakers 2x 2W, Dolby Atmos, Dual-Mic Array with AI Noise Cancellation',
      },
    ],
    description:
      'Engineered for portable AI workflows, the Lenovo Slim 7i pairs Intel Core Ultra 7 256V with 47 TOPS NPU, a vivid 14" OLED panel, and an ultra-thin 1.39 cm aluminum chassis.',
    source: 'url',
  },
  {
    id: 'demo-kindle-paperwhite',
    asin: 'B08KTZ8249',
    marketplace: 'com',
    product_name: 'Amazon Kindle Paperwhite (16 GB) – 6.8" display with adjustable warm light',
    brand: 'Amazon',
    model: 'Kindle Paperwhite (11th Gen)',
    category: 'E-Readers & Office',
    price: '$149.99',
    rating: 4.7,
    review_count: 38400,
    image_url:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    amazon_url: 'https://www.amazon.com/dp/B08KTZ8249',
    key_features: [
      'Now with a 6.8" display and thinner borders for maximum reading area',
      'Adjustable warm light to shift screen shade from white to amber for night reading',
      'Up to 10 weeks of battery life from a single charge via USB-C',
      'Flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight',
      'IPX8 waterproof rated to protect against accidental immersion in fresh water up to 2 meters',
      'Stores thousands of titles with 16 GB of on-device capacity',
    ],
    specifications: [
      { name: 'Screen Size', value: '6.8-inch glare-free Paperwhite display' },
      { name: 'Resolution', value: '300 ppi, 16-level gray scale' },
      { name: 'Storage Capacity', value: '16 GB' },
      { name: 'Battery Life', value: 'Up to 10 weeks (based on 30 min/day reading)' },
      { name: 'Waterproofing', value: 'IPX8 (up to 2 meters for 60 minutes in fresh water)' },
      { name: 'Weight', value: '205 g (7.23 oz)' },
      { name: 'Charging Port', value: 'USB-C (fully charges in ~2.5 hours)' },
    ],
    description:
      'Purpose-built for reading: With a flush-front design and 300 ppi glare-free display that reads like real printed paper. Adjustable warm light lets you read comfortably in any lighting environment.',
    source: 'url',
  },
];
