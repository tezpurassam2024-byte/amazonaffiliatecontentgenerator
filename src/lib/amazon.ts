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
      { name: 'Processor', value: 'Apple M3 chip (8-core CPU, 10-core GPU, 16-core Neural Engine)' },
      { name: 'Unified Memory', value: '16GB Unified Memory' },
      { name: 'Storage', value: '512GB SSD Storage' },
      { name: 'Display', value: '13.6-inch LED-backlit Liquid Retina (2560 x 1664)' },
      { name: 'Weight', value: '1.24 kg (2.7 pounds)' },
      { name: 'Ports', value: 'MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm Headphone Jack' },
      { name: 'Wireless', value: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3' },
      { name: 'Operating System', value: 'macOS Sonoma' },
    ],
    description:
      'The M3 chip brings even greater capabilities to the super-portable 13-inch MacBook Air. Built for Apple Intelligence, it delivers up to 18 hours of battery life and handles demanding workloads with remarkable speed and silent fanless thermal efficiency.',
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
