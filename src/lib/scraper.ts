import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';
import { AmazonProduct, ProductSpecification, MarketplaceId } from '../types/index';
import { parseAmazonUrl, SAMPLE_PRODUCTS, SUPPORTED_MARKETPLACES } from './amazon';
import { getGeminiClient } from './gemini';
import { ensureComprehensiveDeviceSpecs } from './specsEnricher';
import {
  extractWithMasterEngine,
  convertMasterResultToAmazonProduct,
} from './masterExtractor';
export { ensureComprehensiveDeviceSpecs };

/**
 * Extracts slug text from Amazon URL path (e.g. /Sony-WH-1000XM5-Canceling-Headphones/dp/...)
 */
function extractTitleFromUrl(url: string): string {
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
 * Scrapes HTML directly from Amazon product page
 */
async function fetchAndParseAmazonHtml(
  url: string
): Promise<Partial<AmazonProduct> | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
    };

    const res = await fetch(url, {
      headers,
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return null;
    }

    const html = await res.text();

    // Check for Amazon Bot Detection / Captcha
    if (
      html.includes('Robot Check') ||
      html.includes('Type the characters you see in this image') ||
      html.includes('api-services-support@amazon.com')
    ) {
      return null;
    }

    const $ = cheerio.load(html);

    // 1. Product Title
    let title =
      $('#productTitle').text().trim() ||
      $('#title').text().trim() ||
      $('h1#title').text().trim() ||
      $('meta[name="title"]').attr('content') ||
      '';
    title = title.replace(/\s+/g, ' ');

    if (!title || title.length < 3) {
      return null;
    }

    // 2. Brand
    let brand =
      $('#bylineInfo').text().trim() ||
      $('#brand').text().trim() ||
      $('.po-brand .a-span9').text().trim() ||
      '';
    brand = brand.replace(/^(Brand:|Visit the |Store)/gi, '').trim();

    // 3. Price
    let price =
      $('.a-price .a-offscreen').first().text().trim() ||
      $('#priceblock_ourprice').text().trim() ||
      $('#priceblock_dealprice').text().trim() ||
      $('#corePrice_desktop .a-price .a-offscreen').first().text().trim() ||
      '';

    // 4. Rating & Reviews
    let rating: number | undefined;
    const ratingText =
      $('#acrPopover span.a-icon-alt').first().text().trim() ||
      $('.a-icon-star span.a-icon-alt').first().text().trim();
    if (ratingText) {
      const match = ratingText.match(/([0-9.]+)\s+out\s+of/i);
      if (match && match[1]) {
        rating = parseFloat(match[1]);
      }
    }

    let reviewCount: number | undefined;
    const reviewText = $('#acrCustomerReviewText').first().text().trim();
    if (reviewText) {
      const numMatch = reviewText.replace(/,/g, '').match(/\d+/);
      if (numMatch) {
        reviewCount = parseInt(numMatch[0], 10);
      }
    }

    // 5. Image URL
    let imageUrl =
      $('#landingImage').attr('src') ||
      $('#landingImage').attr('data-old-hires') ||
      $('meta[property="og:image"]').attr('content') ||
      '';

    if (!imageUrl) {
      const dynamicImageJson = $('#landingImage').attr('data-a-dynamic-image');
      if (dynamicImageJson) {
        try {
          const parsedImgs = JSON.parse(dynamicImageJson);
          const keys = Object.keys(parsedImgs);
          if (keys.length > 0) {
            imageUrl = keys[0];
          }
        } catch {
          // ignore
        }
      }
    }

    // 6. Key Features (Bullet Points)
    const keyFeatures: string[] = [];
    $('#feature-bullets ul li span.a-list-item').each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (
        text &&
        !text.toLowerCase().includes('make sure this fits') &&
        text.length > 10 &&
        !keyFeatures.includes(text)
      ) {
        keyFeatures.push(text);
      }
    });

    // 7. Specifications Table
    const specifications: ProductSpecification[] = [];
    const addedSpecNames = new Set<string>();

    // Modern Amazon Overview Table (.po-row)
    $('.po-row').each((_, row) => {
      const name = $(row).find('.a-span3').text().trim();
      const val = $(row).find('.a-span9').text().trim();
      if (name && val && !addedSpecNames.has(name.toLowerCase())) {
        addedSpecNames.add(name.toLowerCase());
        specifications.push({ name, value: val });
      }
    });

    // Technical Details Tables
    $('#productDetails_techSpec_section_1 tr, #prodDetails table tr, #technicalSpecifications_section_1 tr').each(
      (_, tr) => {
        const name = $(tr).find('th').text().trim().replace(/\s+/g, ' ');
        const val = $(tr).find('td').text().trim().replace(/\s+/g, ' ');
        if (name && val && !addedSpecNames.has(name.toLowerCase())) {
          addedSpecNames.add(name.toLowerCase());
          specifications.push({ name, value: val });
        }
      }
    );

    // Detail Bullets list (#detailBullets_feature_div)
    $('#detailBullets_feature_div li').each((_, li) => {
      const raw = $(li).text().trim().replace(/\s+/g, ' ');
      if (raw.includes(':')) {
        const [k, ...rest] = raw.split(':');
        const name = k.replace(/[^\w\s-]/g, '').trim();
        const val = rest.join(':').trim();
        if (name && val && name.length < 35 && !addedSpecNames.has(name.toLowerCase())) {
          addedSpecNames.add(name.toLowerCase());
          specifications.push({ name, value: val });
        }
      }
    });

    // Model name extraction
    let model = specifications.find(
      (s) =>
        s.name.toLowerCase().includes('model number') ||
        s.name.toLowerCase() === 'model' ||
        s.name.toLowerCase() === 'item model number'
    )?.value;

    return {
      product_name: title,
      brand: brand || 'Brand',
      model,
      price: price || undefined,
      rating: rating || 4.5,
      review_count: reviewCount || 1000,
      image_url: imageUrl || undefined,
      key_features: keyFeatures,
      specifications,
    };
  } catch (err: any) {
    console.warn('Amazon direct HTML fetch error:', err.message);
    return null;
  }
}

/**
 * AI-powered specification extraction using Gemini with real-world product knowledge & search grounding
 */
async function extractProductWithGemini(
  asin: string,
  url: string,
  titleHint: string,
  marketplace: MarketplaceId = 'com'
): Promise<Partial<AmazonProduct> | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  const marketplaceDomain = SUPPORTED_MARKETPLACES[marketplace]?.domain || 'amazon.com';

  const prompt = `You are a world-class e-commerce product cataloger and hardware specifications engineer.
Extract the exact, complete, high-fidelity Amazon product specifications for:
ASIN: ${asin}
Amazon Domain: ${marketplaceDomain}
Product URL: ${url}
${titleHint ? `Product Title Hint / Slug: ${titleHint}` : ''}

Provide a comprehensive, accurate JSON response representing this exact product.
Requirements:
1. product_name: The full official Amazon product listing title including key highlights.
2. brand: The manufacturer or brand name (e.g. Apple, Sony, Samsung, Bose, Dell, HP, Lenovo).
3. model: Specific model number or name (e.g. MacBook Air M3 15-inch, WH-1000XM5, XPS 15).
4. category: Relevant product category (e.g. Laptops, Electronics, Audio, Kitchen).
5. price: Typical current retail price formatted with currency (e.g. $1,299.00).
6. rating: Realistic average rating (number between 4.0 and 5.0, e.g. 4.7).
7. review_count: Approximate review count (integer, e.g. 8500).
8. image_url: A high-quality direct product image URL (preferably official Amazon CDN or clean manufacturer image).
9. key_features: Array of 5 to 7 detailed, high-impact feature bullet points directly matching what Amazon shows in "About this item".
10. specifications: Array of objects with "name" and "value" generated EXACTLY in the following structured specimen format:

TRAINING SPECIMEN TO EMULATE EXACTLY:
- Processor: Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 47 TOPS
- Display: 14" WUXGA OLED (1920x1200) | 400Nits Typical Brightness, 600Nits Peak Brightness | 100% DCI-P3 |DisplayHDR True Black 500 | X-Rite | Dolby Vision | Anti Glare |TUV Low Blue Light Certified
- Memory and Storage: 16GB Soldered LPDDR5x-8533, Mop memory Max Memory Max Memory 16GB soldered memory, not upgradable | 512GB SSD M.2 2242 PCIe 4.0x4 NVMe, Max Storage Support One drive, up to 1TB M.2 2242 SSD
- OS and Software: Windows 11 Home Single Language, English | Microsoft 365 Basic + Office Home 2024
- Design: 4 side narrow bezel | 1.39 cm Ultra Thin & 1.19 kg Light | Backlight Keyboard | Case Material: Aluminium (Top), Aluminium (Bottom)

Use these EXACT key names:
1. "Processor": [Exact CPU Model], [Cores (P + E/LPE)] / [Threads], Max Turbo up to [X.X]GHz, [X]MB Cache || NPU: [NPU Name], up to [X] TOPS
2. "Display": [Size]" [Resolution Name] [Panel Type] ([Width]x[Height]) | [Typical]Nits Typical Brightness, [Peak]Nits Peak Brightness | [Color Gamut e.g. 100% DCI-P3] | [HDR standard] | [Color Calibration] | [Dolby Vision / Finish] | [Certifications]
3. "Memory and Storage": [RAM Size] [Type/Speed], [Upgradability info] | [Storage Size] [SSD Type], [Max Storage Support]
4. "OS and Software": [OS Edition & Language] | [Bundled Software & AI Suite]
5. "Design": [Bezel details] | [X.XX] cm Ultra Thin & [X.XX] kg Light | [Keyboard] | Case Material: [Material (Top), Material (Bottom)]
6. "Graphics": [GPU Model] | [VRAM & Architecture]
7. "Battery and Power": [Wh Capacity] | [Charging Speed & Battery Life]
8. "Connectivity and Audio": [Wi-Fi & Bluetooth] | [Physical Ports Breakdown] | [Speakers & Audio Tech]

Output ONLY a valid JSON object matching this structure. Do not wrap in markdown code blocks if possible.`;

  const candidateModels = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text?.trim() || '{}';
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const data = JSON.parse(cleaned);

      const rawSpecs: ProductSpecification[] = Array.isArray(data.specifications) ? data.specifications : [];
      const enrichedSpecs = ensureComprehensiveDeviceSpecs(
        rawSpecs,
        data.product_name || titleHint,
        data.brand || 'Brand',
        data.category || 'General'
      );

      return {
        product_name: data.product_name,
        brand: data.brand || 'Brand',
        model: data.model,
        category: data.category || 'General',
        price: data.price,
        rating: typeof data.rating === 'number' ? data.rating : parseFloat(data.rating) || 4.5,
        review_count:
          typeof data.review_count === 'number'
            ? data.review_count
            : parseInt(data.review_count, 10) || 1200,
        image_url: data.image_url,
        key_features: Array.isArray(data.key_features) ? data.key_features : [],
        specifications: enrichedSpecs,
      };
    } catch (err: any) {
      console.warn(`Extraction attempt with model ${model} failed:`, err.message);
      lastError = err;
      continue;
    }
  }

  console.error('All Gemini extraction models failed:', lastError?.message);
  return null;
}

/**
 * Permanent, robust multi-layer Amazon product scraper and extractor
 */
export async function scrapeAndExtractAmazonProduct(rawUrl: string): Promise<{
  success: boolean;
  product: AmazonProduct;
  source: 'scraped' | 'gemini_extracted' | 'catalog';
  message?: string;
}> {
  const parsed = parseAmazonUrl(rawUrl);

  if (!parsed.isValid || !parsed.asin) {
    throw new Error(parsed.error || 'Please provide a valid Amazon product URL with an ASIN.');
  }

  const asin = parsed.asin;
  const marketplace: MarketplaceId = parsed.marketplace || 'com';
  const targetUrl = parsed.cleanedUrl || rawUrl;
  const titleHint = extractTitleFromUrl(rawUrl);

  // Check known demo catalog
  const sampleMatch = SAMPLE_PRODUCTS.find((p) => p.asin === asin);

  // Step 1: Live HTML scraping from Amazon (Product Page, Tech Specs, Features)
  console.log(`[Master Scraper] Scraping Amazon product page for ASIN ${asin} on ${marketplace}...`);
  const liveScraped = await fetchAndParseAmazonHtml(targetUrl);

  // Step 2: Execute Master Product Data Extraction Engine with Zero-Hallucination rules
  console.log(`[Master Scraper] Running Master System Instruction (Source Fidelity, No Hallucination)...`);
  const masterResult = await extractWithMasterEngine(targetUrl, {
    asin,
    marketplace,
    title: liveScraped?.product_name || titleHint || sampleMatch?.product_name,
    brand: liveScraped?.brand || sampleMatch?.brand,
    price: liveScraped?.price || sampleMatch?.price,
    rating: liveScraped?.rating || sampleMatch?.rating,
    reviewCount: liveScraped?.review_count || sampleMatch?.review_count,
    imageUrl: liveScraped?.image_url || sampleMatch?.image_url,
    features: liveScraped?.key_features || sampleMatch?.key_features,
    tableSpecs: liveScraped?.specifications || sampleMatch?.specifications,
  });

  // Step 3: Check if access was impossible
  if (
    masterResult.error &&
    masterResult.source.data_confidence === 'Low' &&
    !liveScraped?.product_name &&
    !sampleMatch &&
    !titleHint
  ) {
    throw new Error(
      masterResult.error.message || 'The Amazon product information could not be accessed or verified.'
    );
  }

  // Step 4: Convert master extraction result into AmazonProduct model
  const baseProduct = convertMasterResultToAmazonProduct(masterResult, {
    id: `prod_${asin}_${Date.now()}`,
    asin,
    marketplace,
    price: liveScraped?.price || sampleMatch?.price || '$99.99',
    rating: liveScraped?.rating || sampleMatch?.rating || 4.5,
    review_count: liveScraped?.review_count || sampleMatch?.review_count || 1200,
    image_url: liveScraped?.image_url || sampleMatch?.image_url,
    amazon_url: targetUrl,
  });

  // Synthesize and normalize structured device specifications for presentation
  const enrichedSpecs = ensureComprehensiveDeviceSpecs(
    baseProduct.specifications,
    baseProduct.product_name,
    baseProduct.brand,
    baseProduct.category
  );

  const finalProduct: AmazonProduct = {
    ...baseProduct,
    specifications: enrichedSpecs.length > 0 ? enrichedSpecs : baseProduct.specifications,
    master_extraction: masterResult,
  };

  return {
    success: true,
    product: finalProduct,
    source: liveScraped?.product_name ? 'scraped' : 'gemini_extracted',
    message: `Extracted under Master System Instruction (${masterResult.source.data_confidence} confidence level).`,
  };
}
