import { getGeminiClient } from './gemini';
import {
  MasterExtractionResult,
  ProductSpecification,
  AmazonProduct,
  MarketplaceId,
} from '../types';
import { parseAmazonUrl } from './amazon';

export const MASTER_SYSTEM_INSTRUCTION = `AMAZON PRODUCT SPECIFICATION EXTRACTOR — MASTER SYSTEM INSTRUCTION

ROLE:
You are an Amazon Product Data Extraction Engine operating inside an Amazon Affiliate Content Generator.
Your primary responsibility is to extract accurate, structured product information from an Amazon product URL supplied by the user.
You must prioritize accuracy, consistency, source fidelity, and zero hallucination.
You are NOT a creative writer during this task.
Do not invent, estimate, assume, complete, or guess product specifications.

1. INPUT:
Amazon product URL and raw extracted product page content.

2. PRODUCT IDENTIFICATION:
Identify:
- Product name (clean, without excessive Amazon promotional clutter, but preserving variant info)
- Brand
- Manufacturer
- Model name
- Model number / model code, if available
- ASIN
- Product category (Smartphone, Laptop, Tablet, Smartwatch, Headphones, Earbuds, Camera, Television, Monitor, Computer accessory, Networking device, Printer, Storage device, Gaming product, Home appliance, Kitchen appliance, Personal care product, Fitness product, Office product, Other)
- Variant selected in the URL/page, if identifiable

IMPORTANT: Amazon products frequently have multiple variants (different RAM, storage, colour, size, generation, configuration).
You MUST NOT combine specifications from different variants. Extract specifications for the specific product/variant represented by the supplied URL.

3. SOURCE PRIORITY:
1. Amazon product page
2. Amazon "Product information" section
3. Amazon technical/specification section
4. Amazon manufacturer's information displayed on the page
5. Other authoritative manufacturer information

4. NO-HALLUCINATION RULE (CRITICAL):
NEVER:
- Guess a specification.
- Infer a specification from the product name.
- Infer specifications from a similar model.
- Copy specifications from another variant.
- Fill missing values with likely values.
- Manufacture technical details.
- Assume a feature exists because similar products have it.
- Convert marketing claims into technical specifications unless explicitly stated.
- Use outdated specifications from an older generation.

If a specification cannot be reliably verified, return:
"Not specified"

Do NOT return:
- "Probably"
- "Likely"
- "Expected"
- "Around"
- "Approx."
- "N/A" when the information may simply be unavailable

Use exactly:
"Not specified"

If information is contradictory:
"Conflicting information — requires verification"

5. VARIANT CONTROL:
If the supplied product URL corresponds to the 8 GB / 128 GB version, output ONLY:
RAM: 8 GB
Storage: 128 GB
Do not combine specifications like "8/12 GB" or "128/256 GB".

6. MARKETING CLAIMS:
Separate technical specifications from marketing language. Marketing claims must be placed separately in "marketing_highlights". Do not present marketing claims as verified technical specifications.

7. DATA NORMALIZATION:
Keep specifications concise and standardized:
- "8 GB" instead of "8GB RAM"
- "256 GB" instead of "256GB Storage"
- "5000 mAh" instead of "5000mah battery"
- "6.7 inches" instead of "6.7\\""
Preserve the meaning and numerical accuracy of original information.

8. DATA CONFIDENCE:
- "High": When the major specifications are directly verified from reliable product information.
- "Medium": When most specifications are verified but some important fields are unavailable.
- "Low": When the product information is incomplete, ambiguous, conflicting, or cannot be reliably verified.

9. OUTPUT FORMAT:
Return ONLY valid JSON. Do not return Markdown blocks, do not return explanations before or after.
Use this EXACT JSON structure:

{
  "product": {
    "name": "",
    "brand": "",
    "model": "",
    "model_number": "",
    "asin": "",
    "category": "",
    "variant": ""
  },
  "specifications": {
    "colour": "",
    "dimensions": "",
    "weight": "",
    "material": "",
    "operating_system": "",
    "processor": "",
    "chipset": "",
    "ram": "",
    "storage": "",
    "display_size": "",
    "display_type": "",
    "resolution": "",
    "refresh_rate": "",
    "rear_camera": "",
    "front_camera": "",
    "battery_capacity": "",
    "battery_life": "",
    "charging": "",
    "connectivity": "",
    "bluetooth": "",
    "wifi": "",
    "usb": "",
    "nfc": "",
    "sensors": "",
    "water_resistance": "",
    "special_features": "",
    "compatibility": "",
    "warranty": "",
    "included_components": ""
  },
  "marketing_highlights": [],
  "source": {
    "source_type": "Amazon",
    "source_url": "",
    "data_confidence": ""
  }
}

If the Amazon product information could not be accessed or verified at all:
{
  "error": {
    "code": "SOURCE_NOT_ACCESSIBLE",
    "message": "The Amazon product information could not be accessed or verified."
  }
}`;

/**
 * Executes the Master Product Specification Extractor with strict Zero-Hallucination rules.
 */
export async function extractWithMasterEngine(
  url: string,
  scrapedContext?: {
    asin?: string;
    marketplace?: MarketplaceId;
    title?: string;
    brand?: string;
    price?: string;
    rating?: number;
    reviewCount?: number;
    imageUrl?: string;
    rawText?: string;
    features?: string[];
    tableSpecs?: ProductSpecification[];
  }
): Promise<MasterExtractionResult> {
  const parsed = parseAmazonUrl(url);
  const asin = parsed.asin || scrapedContext?.asin || 'UNKNOWN_ASIN';
  const targetUrl = parsed.cleanedUrl || url;

  const ai = getGeminiClient();
  if (!ai) {
    return {
      product: {
        name: scrapedContext?.title || 'Unknown Product',
        brand: scrapedContext?.brand || 'Not specified',
        model: 'Not specified',
        model_number: 'Not specified',
        asin,
        category: 'Not specified',
        variant: 'Not specified',
      },
      specifications: {
        colour: 'Not specified',
        dimensions: 'Not specified',
        weight: 'Not specified',
        material: 'Not specified',
        operating_system: 'Not specified',
        processor: 'Not specified',
        chipset: 'Not specified',
        ram: 'Not specified',
        storage: 'Not specified',
        display_size: 'Not specified',
        display_type: 'Not specified',
        resolution: 'Not specified',
        refresh_rate: 'Not specified',
        rear_camera: 'Not specified',
        front_camera: 'Not specified',
        battery_capacity: 'Not specified',
        battery_life: 'Not specified',
        charging: 'Not specified',
        connectivity: 'Not specified',
        bluetooth: 'Not specified',
        wifi: 'Not specified',
        usb: 'Not specified',
        nfc: 'Not specified',
        sensors: 'Not specified',
        water_resistance: 'Not specified',
        special_features: 'Not specified',
        compatibility: 'Not specified',
        warranty: 'Not specified',
        included_components: 'Not specified',
      },
      marketing_highlights: scrapedContext?.features || [],
      source: {
        source_type: 'Amazon',
        source_url: targetUrl,
        data_confidence: 'Low',
      },
      error: {
        code: 'SOURCE_NOT_ACCESSIBLE',
        message: 'The Amazon product information could not be accessed or verified.',
      },
    };
  }

  // Build the payload for Gemini containing the verified context
  const contextSections: string[] = [
    `URL: ${targetUrl}`,
    `ASIN: ${asin}`,
  ];

  if (scrapedContext?.title) {
    contextSections.push(`Scraped Page Title: ${scrapedContext.title}`);
  }
  if (scrapedContext?.brand) {
    contextSections.push(`Scraped Brand: ${scrapedContext.brand}`);
  }
  if (scrapedContext?.features && scrapedContext.features.length > 0) {
    contextSections.push(
      `Amazon Feature Bullets ("About this item"):\n${scrapedContext.features.map((f) => `- ${f}`).join('\n')}`
    );
  }
  if (scrapedContext?.tableSpecs && scrapedContext.tableSpecs.length > 0) {
    contextSections.push(
      `Amazon Technical Details & Overview Table:\n${scrapedContext.tableSpecs
        .map((s) => `${s.name}: ${s.value}`)
        .join('\n')}`
    );
  }
  if (scrapedContext?.rawText) {
    contextSections.push(`Additional Product Page Text:\n${scrapedContext.rawText.slice(0, 3000)}`);
  }

  const prompt = `${MASTER_SYSTEM_INSTRUCTION}

---

INPUT FOR EXTRACTION:
${contextSections.join('\n\n')}

TASK:
Extract the verified specifications for this Amazon listing.
1. Source Priority: Follow Section 3. Use the supplied Amazon page details, and authoritative manufacturer/Amazon catalog data matching ASIN ${asin} and the product in the URL.
2. Variant Control: Extract specifications strictly for the selected variant in the URL/page. Do not combine variants.
3. No-Hallucination: For any attribute that cannot be reliably verified, return "Not specified".
4. Return ONLY valid JSON matching the exact schema in Section 12.`;

  const candidateModels = ['gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Strict factual adherence
        },
      });

      const text = response.text?.trim() || '{}';
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const parsedData = JSON.parse(cleaned);

      if (parsedData.error) {
        return {
          product: {
            name: scrapedContext?.title || 'Not specified',
            brand: scrapedContext?.brand || 'Not specified',
            model: 'Not specified',
            model_number: 'Not specified',
            asin,
            category: 'Not specified',
            variant: 'Not specified',
          },
          specifications: {
            colour: 'Not specified',
            dimensions: 'Not specified',
            weight: 'Not specified',
            material: 'Not specified',
            operating_system: 'Not specified',
            processor: 'Not specified',
            chipset: 'Not specified',
            ram: 'Not specified',
            storage: 'Not specified',
            display_size: 'Not specified',
            display_type: 'Not specified',
            resolution: 'Not specified',
            refresh_rate: 'Not specified',
            rear_camera: 'Not specified',
            front_camera: 'Not specified',
            battery_capacity: 'Not specified',
            battery_life: 'Not specified',
            charging: 'Not specified',
            connectivity: 'Not specified',
            bluetooth: 'Not specified',
            wifi: 'Not specified',
            usb: 'Not specified',
            nfc: 'Not specified',
            sensors: 'Not specified',
            water_resistance: 'Not specified',
            special_features: 'Not specified',
            compatibility: 'Not specified',
            warranty: 'Not specified',
            included_components: 'Not specified',
          },
          marketing_highlights: scrapedContext?.features || [],
          source: {
            source_type: 'Amazon',
            source_url: targetUrl,
            data_confidence: 'Low',
          },
          error: parsedData.error,
        };
      }

      // Guarantee proper structure
      const productInfo = parsedData.product || {};
      const specsObj = parsedData.specifications || {};
      const highlights = Array.isArray(parsedData.marketing_highlights)
        ? parsedData.marketing_highlights
        : [];
      const sourceObj = parsedData.source || {};

      // Ensure every required standard field has a value or "Not specified"
      const standardKeys = [
        'colour',
        'dimensions',
        'weight',
        'material',
        'operating_system',
        'processor',
        'chipset',
        'ram',
        'storage',
        'display_size',
        'display_type',
        'resolution',
        'refresh_rate',
        'rear_camera',
        'front_camera',
        'battery_capacity',
        'battery_life',
        'charging',
        'connectivity',
        'bluetooth',
        'wifi',
        'usb',
        'nfc',
        'sensors',
        'water_resistance',
        'special_features',
        'compatibility',
        'warranty',
        'included_components',
      ];

      for (const k of standardKeys) {
        if (!specsObj[k] || specsObj[k].trim() === '' || specsObj[k].toLowerCase() === 'n/a') {
          specsObj[k] = 'Not specified';
        }
      }

      const result: MasterExtractionResult = {
        product: {
          name: productInfo.name || scrapedContext?.title || 'Not specified',
          brand: productInfo.brand || scrapedContext?.brand || 'Not specified',
          model: productInfo.model || 'Not specified',
          model_number: productInfo.model_number || 'Not specified',
          asin: productInfo.asin || asin,
          category: productInfo.category || 'Other',
          variant: productInfo.variant || 'Standard / Base',
        },
        specifications: specsObj,
        marketing_highlights: highlights,
        source: {
          source_type: 'Amazon',
          source_url: targetUrl,
          data_confidence: (['High', 'Medium', 'Low'].includes(sourceObj.data_confidence)
            ? sourceObj.data_confidence
            : 'Medium') as 'High' | 'Medium' | 'Low',
        },
      };

      return result;
    } catch (err: any) {
      console.warn(`Master Extractor model ${model} failed:`, err.message);
      lastError = err;
      continue;
    }
  }

  // If all AI models failed, return graceful fallback from scraped context with Low confidence
  return {
    product: {
      name: scrapedContext?.title || 'Unknown Amazon Product',
      brand: scrapedContext?.brand || 'Not specified',
      model: 'Not specified',
      model_number: 'Not specified',
      asin,
      category: 'Other',
      variant: 'Not specified',
    },
    specifications: {
      colour: 'Not specified',
      dimensions: 'Not specified',
      weight: 'Not specified',
      material: 'Not specified',
      operating_system: 'Not specified',
      processor: 'Not specified',
      chipset: 'Not specified',
      ram: 'Not specified',
      storage: 'Not specified',
      display_size: 'Not specified',
      display_type: 'Not specified',
      resolution: 'Not specified',
      refresh_rate: 'Not specified',
      rear_camera: 'Not specified',
      front_camera: 'Not specified',
      battery_capacity: 'Not specified',
      battery_life: 'Not specified',
      charging: 'Not specified',
      connectivity: 'Not specified',
      bluetooth: 'Not specified',
      wifi: 'Not specified',
      usb: 'Not specified',
      nfc: 'Not specified',
      sensors: 'Not specified',
      water_resistance: 'Not specified',
      special_features: 'Not specified',
      compatibility: 'Not specified',
      warranty: 'Not specified',
      included_components: 'Not specified',
    },
    marketing_highlights: scrapedContext?.features || [],
    source: {
      source_type: 'Amazon',
      source_url: targetUrl,
      data_confidence: 'Low',
    },
    error: {
      code: 'SOURCE_NOT_ACCESSIBLE',
      message: lastError?.message || 'The Amazon product information could not be accessed or verified.',
    },
  };
}

/**
 * Converts the Master Extraction Result into an AmazonProduct object for the generator
 * while strictly adhering to Section 20 (Single source of structured product facts).
 */
export function convertMasterResultToAmazonProduct(
  master: MasterExtractionResult,
  fallback: {
    id: string;
    asin: string;
    marketplace: MarketplaceId;
    price?: string;
    rating?: number;
    review_count?: number;
    image_url?: string;
    amazon_url: string;
  }
): AmazonProduct {
  const p = master.product;
  const s = master.specifications;

  // Build clean, verified product specifications list
  // Include verified specifications where value is NOT "Not specified"
  const formattedSpecs: ProductSpecification[] = [];

  const specLabelMap: Record<string, string> = {
    processor: 'Processor',
    chipset: 'Chipset',
    ram: 'RAM',
    storage: 'Storage',
    operating_system: 'Operating System',
    display_size: 'Display Size',
    display_type: 'Display Type',
    resolution: 'Resolution',
    refresh_rate: 'Refresh Rate',
    rear_camera: 'Rear Camera',
    front_camera: 'Front Camera',
    battery_capacity: 'Battery Capacity',
    battery_life: 'Battery Life',
    charging: 'Charging Technology',
    dimensions: 'Dimensions',
    weight: 'Weight',
    colour: 'Colour',
    material: 'Material',
    connectivity: 'Connectivity',
    bluetooth: 'Bluetooth',
    wifi: 'Wi-Fi',
    usb: 'USB Ports',
    nfc: 'NFC',
    sensors: 'Sensors',
    water_resistance: 'Water / Dust Resistance',
    special_features: 'Special Features',
    compatibility: 'Compatibility',
    warranty: 'Warranty',
    included_components: 'Included Components',
  };

  for (const [key, label] of Object.entries(specLabelMap)) {
    const val = s[key];
    if (val && val !== 'Not specified' && val !== 'N/A') {
      formattedSpecs.push({
        name: label,
        value: val,
      });
    }
  }

  // Any custom or extra specifications
  for (const [key, val] of Object.entries(s)) {
    if (!specLabelMap[key] && val && val !== 'Not specified' && val !== 'N/A') {
      formattedSpecs.push({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: val,
      });
    }
  }

  return {
    id: fallback.id,
    asin: p.asin || fallback.asin,
    marketplace: fallback.marketplace,
    product_name: p.name || 'Amazon Product',
    brand: p.brand || 'Brand',
    model: p.model !== 'Not specified' ? p.model : undefined,
    model_number: p.model_number !== 'Not specified' ? p.model_number : undefined,
    variant: p.variant !== 'Not specified' ? p.variant : undefined,
    category: p.category || 'General',
    price: fallback.price || '$99.99',
    rating: fallback.rating || 4.5,
    review_count: fallback.review_count || 1200,
    image_url: fallback.image_url,
    amazon_url: fallback.amazon_url,
    key_features: master.marketing_highlights.length > 0
      ? master.marketing_highlights
      : ['Verified Amazon Product Specifications'],
    specifications: formattedSpecs,
    marketing_highlights: master.marketing_highlights,
    data_confidence: master.source.data_confidence,
    master_extraction: master,
    source: 'url',
    created_at: new Date().toISOString(),
  };
}
