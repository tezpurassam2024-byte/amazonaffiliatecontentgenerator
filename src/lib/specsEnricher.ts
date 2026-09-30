import { ProductSpecification } from '../types/index';

/**
 * Builds the exact reference specimen processor detail string matching the device ecosystem:
 * - Apple Mac: Apple M-Series Silicon (M4 / M3 Pro / M3 / M2)
 * - Intel Lunar Lake / Core Ultra: Intel Core Ultra 7 256V, etc.
 * - Intel Raptor / Alder Lake: Intel Core i9 / i7 / i5
 * - AMD Ryzen: Ryzen 9 / 7 / 5
 * - Qualcomm Snapdragon: Snapdragon X Elite / Plus
 */
export function buildSpecimenProcessor(rawCandidate: string = '', productName: string = ''): string {
  const combined = `${rawCandidate} ${productName}`.toLowerCase();

  // If already in exact full specimen format with NPU, TOPS, and GHz, normalize single pipe and return
  if (
    (/NPU:/i.test(rawCandidate) || /Neural/i.test(rawCandidate)) &&
    /GHz/i.test(rawCandidate) &&
    /\d+C/i.test(rawCandidate)
  ) {
    return rawCandidate.replace(/\s*\|\|\s*/g, ' | ').trim();
  }

  // ==========================================
  // 1. APPLE SILICON ECOSYSTEM
  // ==========================================
  const isApple =
    combined.includes('apple') ||
    combined.includes('macbook') ||
    combined.includes('mac ') ||
    combined.includes('mac mini') ||
    combined.includes('imac') ||
    combined.includes('mac studio') ||
    combined.includes('macos');

  if (isApple) {
    if (combined.includes('m4 max')) {
      return 'Apple M4 Max Chip, 16C (12P + 4E) / 16T, Max Turbo up to 4.4GHz, 48MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m4 pro')) {
      return 'Apple M4 Pro Chip, 14C (10P + 4E) / 14T, Max Turbo up to 4.4GHz, 36MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m4')) {
      return 'Apple M4 Chip, 10C (4P + 6E) / 10T, Max Turbo up to 4.4GHz, 28MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m3 max')) {
      return 'Apple M3 Max Chip, 14C (10P + 4E) / 14T, Max Turbo up to 4.05GHz, 48MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m3 pro') || (combined.includes('pro') && combined.includes('macbook') && !combined.includes('m2') && !combined.includes('m1'))) {
      return 'Apple M3 Pro Chip, 11C (5P + 6E) / 11T, Max Turbo up to 4.05GHz, 36MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m3')) {
      return 'Apple M3 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 4.05GHz, 24MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
    }
    if (combined.includes('m2 max')) {
      return 'Apple M2 Max Chip, 12C (8P + 4E) / 12T, Max Turbo up to 3.7GHz, 36MB Unified Cache | NPU: 16-Core Neural Engine, up to 15.8 TOPS';
    }
    if (combined.includes('m2 pro')) {
      return 'Apple M2 Pro Chip, 10C (6P + 4E) / 10T, Max Turbo up to 3.5GHz, 30MB Unified Cache | NPU: 16-Core Neural Engine, up to 15.8 TOPS';
    }
    if (combined.includes('m2')) {
      return 'Apple M2 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 3.5GHz, 20MB Unified Cache | NPU: 16-Core Neural Engine, up to 15.8 TOPS';
    }
    if (combined.includes('m1 max') || combined.includes('m1 pro')) {
      return 'Apple M1 Pro Chip, 10C (8P + 2E) / 10T, Max Turbo up to 3.2GHz, 30MB Unified Cache | NPU: 16-Core Neural Engine, up to 11 TOPS';
    }
    if (combined.includes('m1')) {
      return 'Apple M1 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 3.2GHz, 16MB Unified Cache | NPU: 16-Core Neural Engine, up to 11 TOPS';
    }
    return 'Apple M3 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 4.05GHz, 24MB Unified Cache | NPU: 16-Core Neural Engine, up to 38 TOPS';
  }

  // ==========================================
  // 2. INTEL CORE ULTRA
  // ==========================================
  if (
    combined.includes('256v') ||
    combined.includes('ultra 7 256') ||
    (combined.includes('ultra 7') && !combined.includes('155h')) ||
    (combined.includes('core ultra 7') && !combined.includes('155h'))
  ) {
    return 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 47 TOPS';
  }

  if (combined.includes('288v') || (combined.includes('ultra 9') && !combined.includes('185h'))) {
    return 'Intel Core Ultra 9 288V, 8C (4P + 4LPE) / 8T, Max Turbo up to 5.1GHz, 12MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 48 TOPS';
  }

  if (
    combined.includes('226v') ||
    combined.includes('228v') ||
    (combined.includes('ultra 5') && !combined.includes('125h'))
  ) {
    return 'Intel Core Ultra 5 226V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.5GHz, 8MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 40 TOPS';
  }

  if (combined.includes('155h')) {
    return 'Intel Core Ultra 7 155H, 16C (6P + 8E + 2LPE) / 22T, Max Turbo up to 4.8GHz, 24MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 34 TOPS';
  }

  if (combined.includes('185h')) {
    return 'Intel Core Ultra 9 185H, 16C (6P + 8E + 2LPE) / 22T, Max Turbo up to 5.1GHz, 24MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 34 TOPS';
  }

  if (combined.includes('125h')) {
    return 'Intel Core Ultra 5 125H, 14C (4P + 8E + 2LPE) / 18T, Max Turbo up to 4.5GHz, 18MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 34 TOPS';
  }

  if (combined.includes('core ultra') || combined.includes('lunar lake') || combined.includes('intel ultra')) {
    return 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 47 TOPS';
  }

  // ==========================================
  // 3. AMD RYZEN SERIES
  // ==========================================
  if (combined.includes('8945hs') || (combined.includes('ryzen 9') && combined.includes('8000'))) {
    return 'AMD Ryzen 9 8945HS, 8C / 16T, Max Boost up to 5.2GHz, 16MB L3 Cache | NPU: AMD Ryzen AI, up to 16 TOPS (39 TOPS Total)';
  }
  if (combined.includes('8845hs') || combined.includes('7840hs') || (combined.includes('ryzen 7') && combined.includes('8000'))) {
    return 'AMD Ryzen 7 8845HS, 8C / 16T, Max Boost up to 5.1GHz, 16MB L3 Cache | NPU: AMD Ryzen AI, up to 16 TOPS (38 TOPS Total)';
  }
  if (combined.includes('7735hs') || combined.includes('7730u') || combined.includes('ryzen 7')) {
    return 'AMD Ryzen 7 7735HS, 8C / 16T, Max Boost up to 4.75GHz, 16MB L3 Cache | NPU: AMD Radeon 680M Integrated Graphics Engine';
  }
  if (combined.includes('8645hs') || combined.includes('7640hs') || combined.includes('ryzen 5')) {
    return 'AMD Ryzen 5 8645HS, 6C / 12T, Max Boost up to 5.0GHz, 16MB L3 Cache | NPU: AMD Ryzen AI, up to 16 TOPS (31 TOPS Total)';
  }

  // ==========================================
  // 4. QUALCOMM SNAPDRAGON X
  // ==========================================
  if (combined.includes('snapdragon x elite') || combined.includes('x elite')) {
    return 'Qualcomm Snapdragon X Elite X1E-80-100, 12C / 12T, Multithread up to 3.4GHz, 42MB Total Cache | NPU: Qualcomm Hexagon NPU, up to 45 TOPS';
  }
  if (combined.includes('snapdragon x plus') || combined.includes('x plus')) {
    return 'Qualcomm Snapdragon X Plus X1P-64-100, 10C / 10T, Multithread up to 3.4GHz, 42MB Total Cache | NPU: Qualcomm Hexagon NPU, up to 45 TOPS';
  }

  // ==========================================
  // 5. INTEL CORE I9 / I7 / I5 (13th / 14th Gen)
  // ==========================================
  if (combined.includes('14900hx') || combined.includes('14900')) {
    return 'Intel Core i9-14900HX, 24C (8P + 16E) / 32T, Max Turbo up to 5.8GHz, 36MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('13900h') || combined.includes('i9')) {
    return 'Intel Core i9-13900H, 14C (6P + 8E) / 20T, Max Turbo up to 5.4GHz, 24MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('13700h')) {
    return 'Intel Core i7-13700H, 14C (6P + 8E) / 20T, Max Turbo up to 5.0GHz, 24MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('12650h')) {
    return 'Intel Core i7-12650H, 10C (6P + 4E) / 16T, Max Turbo up to 4.7GHz, 24MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('13650hx')) {
    return 'Intel Core i7-13650HX, 14C (6P + 8E) / 20T, Max Turbo up to 4.9GHz, 24MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('1355u') || (combined.includes('i7') && combined.includes('u'))) {
    return 'Intel Core i7-1355U, 10C (2P + 8E) / 12T, Max Turbo up to 5.0GHz, 12MB Intel Smart Cache | NPU: Intel GNA 3.0 Dedicated Image Signal Processor';
  }
  if (combined.includes('i7')) {
    return 'Intel Core i7-13700H, 14C (6P + 8E) / 20T, Max Turbo up to 5.0GHz, 24MB Intel Smart Cache | NPU: Intel Gaussian & Neural Accelerator 3.0';
  }
  if (combined.includes('13420h') || combined.includes('12450h') || combined.includes('i5')) {
    return 'Intel Core i5-13420H, 8C (4P + 4E) / 12T, Max Turbo up to 4.6GHz, 12MB Intel Smart Cache | NPU: Intel GNA 3.0';
  }

  // Preserve non-empty string
  if (rawCandidate && rawCandidate.length > 5 && !rawCandidate.toLowerCase().includes('not specified')) {
    return `${rawCandidate.trim()} | High-Performance Multi-Core Architecture`;
  }

  // Default for general Windows PC
  return 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache | NPU: Integrated Intel AI Boost, up to 47 TOPS';
}

/**
 * Transforms and enriches specifications into the exact consolidated statement format
 * tailored strictly to device category and manufacturer architecture.
 *
 * Supported Device Classes:
 * 1. Laptops & Computers (MacBook, ThinkPad, Dell, HP, etc.)
 * 2. Headphones & Audio (Sony WH-1000, AirPods, Bose QC, etc.)
 * 3. Smartphones & Mobile (iPhone, Galaxy S/Z, Pixel, etc.)
 * 4. Smartwatches & Wearables (Apple Watch, Galaxy Watch, Garmin, etc.)
 * 5. General Consumer Electronics
 */
export function ensureComprehensiveDeviceSpecs(
  specs: ProductSpecification[] = [],
  productName: string = '',
  brand: string = '',
  category: string = ''
): ProductSpecification[] {
  const lowerName = (productName || '').toLowerCase();
  const lowerCat = (category || '').toLowerCase();
  const lowerBrand = (brand || '').toLowerCase();

  const isApple =
    lowerBrand.includes('apple') ||
    lowerName.includes('apple') ||
    lowerName.includes('macbook') ||
    lowerName.includes('imac') ||
    lowerName.includes('mac mini') ||
    lowerName.includes('mac studio') ||
    lowerName.includes('macos');

  const isAudio =
    lowerName.includes('headphone') ||
    lowerName.includes('earbud') ||
    lowerName.includes('earphone') ||
    lowerName.includes('airpod') ||
    lowerName.includes('speaker') ||
    lowerName.includes('soundbar') ||
    lowerName.includes('wh 1000') ||
    lowerName.includes('wh-1000') ||
    lowerName.includes('wf 1000') ||
    lowerName.includes('wf-1000') ||
    lowerName.includes('xm5') ||
    lowerName.includes('xm4') ||
    lowerName.includes('quietcomfort') ||
    lowerName.includes('soundcore') ||
    lowerName.includes('canceling') ||
    lowerName.includes('cancelling') ||
    lowerName.includes('audio') ||
    lowerCat.includes('audio') ||
    lowerCat.includes('headphone');

  const isPhone =
    !isAudio &&
    (lowerName.includes('iphone') ||
      lowerName.includes('galaxy s') ||
      lowerName.includes('galaxy z') ||
      lowerName.includes('pixel ') ||
      lowerName.includes('smartphone') ||
      lowerName.includes('oneplus') ||
      lowerCat.includes('phone') ||
      lowerCat.includes('smartphone'));

  const isWatch =
    lowerName.includes('watch') ||
    lowerName.includes('smartwatch') ||
    lowerName.includes('garmin') ||
    lowerName.includes('fitbit') ||
    lowerCat.includes('watch') ||
    lowerCat.includes('wearable');

  const isLaptop =
    !isAudio &&
    !isPhone &&
    !isWatch &&
    (isApple ||
      lowerName.includes('laptop') ||
      lowerName.includes('notebook') ||
      lowerName.includes('chromebook') ||
      lowerName.includes('thinkpad') ||
      lowerName.includes('ideapad') ||
      lowerName.includes('zenbook') ||
      lowerName.includes('vivobook') ||
      lowerName.includes('yoga') ||
      lowerName.includes('gram') ||
      lowerName.includes('surface pro') ||
      lowerName.includes('surface laptop') ||
      lowerName.includes('legion') ||
      lowerName.includes('predator') ||
      lowerName.includes('alienware') ||
      lowerName.includes('inspiron') ||
      lowerName.includes('latitude') ||
      lowerName.includes('xps') ||
      lowerName.includes('katana') ||
      lowerName.includes('spectre') ||
      lowerName.includes('envy') ||
      lowerName.includes('pavilion') ||
      lowerName.includes('swift') ||
      lowerName.includes('galaxy book') ||
      lowerCat.includes('laptop') ||
      lowerCat.includes('computer'));

  const getExisting = (regex: RegExp): string => {
    const found = specs.find((s) => regex.test(s.name.toLowerCase()));
    return found ? found.value.replace(/\s*\|\|\s*/g, ' | ') : '';
  };

  // ==========================================
  // 1. LAPTOP / COMPUTER SPECIMEN GENERATOR
  // ==========================================
  if (isLaptop) {
    const rawCpuClues = [
      getExisting(/^processor$/i),
      getExisting(/^processor \/ cpu$/i),
      getExisting(/^processor type$/i),
      getExisting(/^cpu model$/i),
      getExisting(/^cpu$/i),
      ...specs
        .filter((s) => /processor|cpu|chip/i.test(s.name))
        .map((s) => `${s.name}: ${s.value}`),
    ].filter(Boolean).join(' ');

    const procVal = buildSpecimenProcessor(rawCpuClues, productName);

    let dispVal = getExisting(/^display$/i);
    if (!dispVal || !dispVal.includes('|')) {
      if (isApple) {
        if (lowerName.includes('16') || lowerName.includes('16.2')) {
          dispVal = '16.2" Liquid Retina XDR Mini-LED (3456x2234) | 1000 Nits Sustained, 1600 Nits Peak Brightness | 100% DCI-P3 Wide Color | ProMotion 120Hz | True Tone | Anti-Reflective';
        } else if (lowerName.includes('14') || lowerName.includes('14.2') || lowerName.includes('pro')) {
          dispVal = '14.2" Liquid Retina XDR Mini-LED (3024x1964) | 1000 Nits Sustained, 1600 Nits Peak Brightness | 100% DCI-P3 Wide Color | ProMotion 120Hz | True Tone | Anti-Reflective';
        } else if (lowerName.includes('15') || lowerName.includes('15.3')) {
          dispVal = '15.3" Liquid Retina IPS (2880x1864) | 500 Nits Typical Brightness | 100% DCI-P3 Wide Color | True Tone Technology | Anti-Reflective | 1 Billion Colors';
        } else {
          dispVal = '13.6" Liquid Retina IPS (2560x1664) | 500 Nits Typical Brightness | 100% DCI-P3 Wide Color | True Tone Technology | Anti-Reflective | 1 Billion Colors';
        }
      } else if (lowerName.includes('oled') && lowerName.includes('14')) {
        dispVal = '14" WUXGA OLED (1920x1200) | 400 Nits Typical Brightness, 600 Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black 500 | X-Rite | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else if (lowerName.includes('oled')) {
        dispVal = '15.6" 2.8K OLED (2880x1800) | 400 Nits Typical Brightness, 600 Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black 600 | 120Hz 0.2ms | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else if (lowerName.includes('14')) {
        dispVal = '14" 2.2K IPS (2240x1400) | 400 Nits Typical Brightness, 500 Nits Peak Brightness | 100% sRGB | DisplayHDR 400 | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else if (lowerName.includes('17.3') || lowerName.includes('17')) {
        dispVal = '17.3" FHD IPS (1920x1080) | 300 Nits Typical Brightness, 450 Nits Peak Brightness | 144Hz Refresh Rate | 100% sRGB | Anti Glare | TUV Low Blue Light Certified';
      } else {
        dispVal = '15.6" FHD IPS (1920x1080) | 350 Nits Typical Brightness, 500 Nits Peak Brightness | 100% sRGB | DisplayHDR 400 | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      }
    }

    let memStoreVal = getExisting(/^memory and storage$/i) || getExisting(/^memory & storage$/i);
    if (!memStoreVal || !memStoreVal.includes('|')) {
      const is32GB = lowerName.includes('32gb') || lowerName.includes('36gb');
      const is8GB = lowerName.includes('8gb');
      const is1TB = lowerName.includes('1tb');
      const is2TB = lowerName.includes('2tb');
      const is256GB = lowerName.includes('256gb');

      let ramPart = '16GB Soldered LPDDR5x-8533 | Max Memory: 16GB soldered memory, not upgradable';
      if (isApple) {
        if (is8GB) ramPart = '8GB Soldered Unified Memory LPDDR5-6400 (100GB/s bandwidth) | Unified Memory Architecture, not upgradable';
        else if (is32GB) ramPart = '36GB Soldered Unified Memory LPDDR5-6400 (150GB/s bandwidth) | Unified Memory Architecture, not upgradable';
        else ramPart = '16GB Soldered Unified Memory LPDDR5-6400 (100GB/s bandwidth) | Unified Memory Architecture, not upgradable';
      } else if (lowerName.includes('katana') || lowerName.includes('ddr5')) {
        ramPart = is32GB
          ? '32GB DDR5-5200MHz Dual-Channel (2x 16GB SO-DIMM) | Upgradable up to 64GB DDR5'
          : '16GB DDR5-5200MHz Dual-Channel (2x 8GB SO-DIMM) | Upgradable up to 64GB DDR5';
      } else if (is8GB) {
        ramPart = '8GB Soldered LPDDR5x-6400 | Max Memory: 8GB soldered memory, not upgradable';
      } else if (is32GB) {
        ramPart = '32GB Soldered LPDDR5x-8533 | Max Memory: 32GB soldered memory, not upgradable';
      }

      let ssdPart = '512GB SSD M.2 2242 PCIe 4.0x4 NVMe | Max Storage Support: One drive, up to 1TB M.2 2242 SSD';
      if (isApple) {
        if (is256GB) ssdPart = '256GB SSD PCIe 4.0x4 NVMe | High-Speed Apple Unified Flash Storage';
        else if (is1TB) ssdPart = '1TB SSD PCIe 4.0x4 NVMe | High-Speed Apple Unified Flash Storage';
        else if (is2TB) ssdPart = '2TB SSD PCIe 4.0x4 NVMe | High-Speed Apple Unified Flash Storage';
        else ssdPart = '512GB SSD PCIe 4.0x4 NVMe | High-Speed Apple Unified Flash Storage';
      } else if (is1TB) {
        ssdPart = '1TB SSD M.2 2280 PCIe 4.0x4 NVMe | Max Storage Support: Up to 2TB M.2 SSD';
      } else if (is256GB) {
        ssdPart = '256GB SSD M.2 2242 PCIe 4.0x4 NVMe | Max Storage Support: Up to 1TB M.2 2242 SSD';
      }

      memStoreVal = `${ramPart} | ${ssdPart}`;
    }

    let osVal = getExisting(/^os and software$/i) || getExisting(/^os & software$/i);
    if (!osVal || !osVal.includes('|')) {
      if (isApple) {
        osVal = 'macOS Sonoma (pre-installed, lifetime free OS upgrades) | Apple Intelligence Ready + iWork Suite (Pages, Numbers, Keynote)';
      } else if (lowerName.includes('chromebook')) {
        osVal = 'ChromeOS with automated background security updates | Google Play Store + Google One 100GB Cloud Trial';
      } else if (lowerName.includes('pro')) {
        osVal = 'Windows 11 Pro 64-bit, English | Microsoft 365 Basic + Office Home & Business 2024';
      } else {
        osVal = 'Windows 11 Home Single Language, English | Microsoft 365 Basic + Office Home 2024';
      }
    }

    let designVal = getExisting(/^design$/i);
    if (!designVal || !designVal.includes('|')) {
      if (isApple) {
        if (lowerName.includes('14') || lowerName.includes('pro')) {
          designVal = '4-side narrow bezel with 5mm uniform borders | 1.55 cm Ultra Thin | 1.62 kg Light | Backlit Magic Keyboard with Touch ID | Case Material: 100% Recycled Aluminium Unibody (Top & Bottom)';
        } else if (lowerName.includes('15') || lowerName.includes('15.3')) {
          designVal = '4-side narrow bezel with 5mm uniform borders | 1.15 cm Ultra Thin | 1.51 kg Light | Backlit Magic Keyboard with Touch ID | Case Material: 100% Recycled Aluminium Unibody (Top & Bottom)';
        } else {
          designVal = '4-side narrow bezel with 5mm uniform borders | 1.13 cm Ultra Thin | 1.24 kg Light | Backlit Magic Keyboard with Touch ID | Case Material: 100% Recycled Aluminium Unibody (Top & Bottom)';
        }
      } else if (lowerName.includes('thinkpad')) {
        designVal = '4-side narrow bezel | 1.49 cm Ultra Thin | 1.26 kg Light | Spill-resistant Backlit Keyboard with TrackPoint | Case Material: Carbon Fiber Top, Aluminium Bottom';
      } else if (lowerName.includes('14')) {
        designVal = '4-side narrow bezel | 1.39 cm Ultra Thin | 1.19 kg Light | Backlit Keyboard | Case Material: Aluminium Top, Aluminium Bottom';
      } else if (lowerName.includes('katana') || lowerName.includes('17')) {
        designVal = 'Narrow border gaming chassis | 2.51 cm Profile | 2.60 kg | 4-Zone RGB Backlit Keyboard | Case Material: Aluminium Top, Reinforced Composite Bottom';
      } else {
        designVal = '4-side narrow bezel | 1.39 cm Ultra Thin | 1.19 kg Light | Backlit Keyboard | Case Material: Aluminium Top, Aluminium Bottom';
      }
    }

    let gfxVal = getExisting(/^graphics$/i);
    if (!gfxVal) {
      if (isApple) {
        gfxVal = 'Integrated Apple 10-Core GPU | Hardware-Accelerated Ray Tracing, Dynamic Caching, Mesh Shading';
      } else if (lowerName.includes('rtx 4070')) {
        gfxVal = 'NVIDIA GeForce RTX 4070 8GB GDDR6 Dedicated Graphics | 140W TGP, DLSS 3.5, Ada Lovelace Architecture';
      } else if (lowerName.includes('rtx 4060')) {
        gfxVal = 'NVIDIA GeForce RTX 4060 8GB GDDR6 Dedicated Graphics | 115W TGP, DLSS 3.5, Ada Lovelace Architecture';
      } else if (lowerName.includes('rtx 4050')) {
        gfxVal = 'NVIDIA GeForce RTX 4050 6GB GDDR6 Dedicated Graphics | 105W TGP, DLSS 3.5, Ada Lovelace Architecture';
      } else if (lowerName.includes('ultra 7') || lowerName.includes('ultra 9')) {
        gfxVal = 'Integrated Intel Arc 140V Graphics | DirectX 12 Ultimate, Ray Tracing, Intel XeSS AI Super Sampling';
      } else {
        gfxVal = 'Integrated Intel Arc Graphics | DirectX 12 Ultimate, Intel XeSS AI Super Sampling';
      }
    }

    let battVal = getExisting(/^battery and power$/i) || getExisting(/^battery & power$/i) || getExisting(/^battery$/i);
    if (!battVal) {
      if (isApple) {
        battVal = '66.5Wh Integrated Lithium-Polymer Battery | MagSafe 3 Fast Charging with 35W/70W Adapter (Up to 18 Hours Apple TV playback, 15 Hours Wireless Web)';
      } else if (lowerName.includes('katana') || lowerName.includes('gaming')) {
        battVal = '53.5Wh Integrated 3-Cell Li-Polymer Battery | 200W High-Output AC Fast Adapter';
      } else {
        battVal = '70Wh Integrated 4-Cell Li-Polymer Battery | Rapid Charge Boost (Up to 18 Hours Video Playback, 15 min charge for 3 hours use)';
      }
    }

    let connVal = getExisting(/^connectivity and audio$/i) || getExisting(/^connectivity & audio$/i) || getExisting(/^connectivity$/i);
    if (!connVal) {
      if (isApple) {
        connVal = 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3 | MagSafe 3, 2x Thunderbolt 4 / USB 4 (40Gbps), 3.5mm Headphone Jack with High-Impedance Support | Six-speaker sound system with force-cancelling woofers, Spatial Audio, 3-mic array';
      } else {
        connVal = 'Wi-Fi 7 (802.11be) 2x2 + Bluetooth 5.4 | 2x Thunderbolt 4 / USB4 40Gbps, 1x USB-A 3.2 Gen 1, 1x HDMI 2.1, 3.5mm Headphone Jack | Stereo Speakers 2x 2W, Dolby Atmos, Dual-Mic Array with AI Noise Cancellation';
      }
    }

    return [
      { name: 'Processor', value: procVal },
      { name: 'Display', value: dispVal },
      { name: 'Memory and Storage', value: memStoreVal },
      { name: 'OS and Software', value: osVal },
      { name: 'Design', value: designVal },
      { name: 'Graphics', value: gfxVal },
      { name: 'Battery', value: battVal },
      { name: 'Connectivity', value: connVal },
    ];
  }

  // ==========================================
  // 2. HEADPHONES & AUDIO SPECIMEN GENERATOR
  // ==========================================
  if (isAudio) {
    const isSony = lowerBrand.includes('sony') || lowerName.includes('sony') || lowerName.includes('wh-1000') || lowerName.includes('wf-1000');
    const isBose = lowerBrand.includes('bose') || lowerName.includes('bose') || lowerName.includes('quietcomfort');

    return [
      {
        name: 'Acoustic Architecture',
        value: isSony
          ? '30mm Carbon Fiber Composite Precision Drivers | Integrated Processor V1 + HD Noise Canceling Processor QN1 | Hi-Res Audio Wireless (LDAC) & DSEE Extreme Up-scaling'
          : isBose
          ? 'Custom TriPort Acoustic Architecture | Active EQ volume-optimized curve | High-Fidelity Lossless Bluetooth Audio'
          : 'High-Fidelity 40mm Dynamic Drivers | Custom Neodymium Magnet Array | Wide-Bandwidth Frequency Response 20Hz - 20,000Hz',
      },
      {
        name: 'Active Noise Cancellation',
        value: isSony
          ? 'Dual-Chip Auto NC Optimizer with 8 Microphones | Atmospheric Pressure Optimizing | Ambient Sound Mode (20-Level Control with Voice Passthrough)'
          : 'Multi-Microphone Hybrid Active Noise Cancellation | Aware Transparency Mode with ActiveSense | Wind Noise Reduction Algorithms',
      },
      {
        name: 'Battery and Fast Charging',
        value: isSony
          ? 'Up to 30 Hours Playback (NC ON), 40 Hours (NC OFF) | USB-PD Ultra Fast Charge (3 min charge gives 3 hours playback) | USB Type-C Charging'
          : 'Up to 24 Hours Continuous Playback | 15-Minute Fast Charge gives 2.5 hours playback | USB Type-C Universal Charging',
      },
      {
        name: 'Connectivity and Codecs',
        value: 'Bluetooth 5.2 / 5.3 with Multi-Point Dual Device Pairing | Supported Codecs: LDAC, AAC, SBC | 3.5mm Gold-Plated Audio Cable Included',
      },
      {
        name: 'Microphones and Call Quality',
        value: '4 Beamforming Microphones with AI Noise Reduction | Precise Voice Pickup Technology with bone conduction sensing | Wind noise dampening structure',
      },
      {
        name: 'Design and Comfort',
        value: 'Soft-Fit Synthetic Leather Cushions with Stepless Slider | Lightweight Ergonomic Over-Ear Fit (250g) | Collapsible Lay-Flat Swivel Mechanism',
      },
      {
        name: 'Smart Features and Controls',
        value: 'Touch Sensor Controls (Volume, Track, Calls) | Speak-to-Chat & Quick Attention Mode | Google Assistant & Amazon Alexa Built-in',
      },
    ];
  }

  // ==========================================
  // 3. SMARTPHONE SPECIMEN GENERATOR
  // ==========================================
  if (isPhone) {
    const isSamsung = lowerBrand.includes('samsung') || lowerName.includes('samsung') || lowerName.includes('galaxy');
    const isApplePhone = lowerBrand.includes('apple') || lowerName.includes('iphone');

    return [
      {
        name: 'Processor',
        value: isApplePhone
          ? 'Apple A18 Pro Bionic, 6C (2P + 4E) / 6T, 3nm Architecture | 6-Core Apple GPU with Ray Tracing | NPU: 16-Core Neural Engine, up to 35 TOPS (Apple Intelligence Ready)'
          : isSamsung
          ? 'Qualcomm Snapdragon 8 Gen 3 for Galaxy, 8C, up to 3.39GHz, 4nm Architecture | Adreno 750 GPU | NPU: Qualcomm Hexagon AI Engine (Galaxy AI Enabled)'
          : 'Qualcomm Snapdragon 8 Gen 3 Octa-Core Flagship Processor | High-Performance Adreno GPU | On-Device AI Engine',
      },
      {
        name: 'Display',
        value: isApplePhone
          ? '6.7" Super Retina XDR OLED (2796x1290) | 1000 Nits Sustained, 2000 Nits Peak Outdoor Brightness | 120Hz ProMotion Adaptive Refresh Rate | Ceramic Shield Front Glass'
          : '6.8" Dynamic AMOLED 2X Quad HD+ (3120x1440) | 2600 Nits Peak Brightness | 1-120Hz Adaptive Refresh Rate | Corning Gorilla Armor Anti-Reflective Glass',
      },
      {
        name: 'Camera System',
        value: isApplePhone
          ? 'Pro Triple Camera: 48MP Fusion (f/1.78, Sensor-shift OIS) + 48MP Ultra-Wide + 12MP 5x Telephoto (120mm) | 4K Dolby Vision 120fps recording'
          : 'Quad Camera: 200MP Wide (f/1.7, OIS) + 50MP Periscope Telephoto (5x Optical, 100x Space Zoom) + 12MP Ultra-Wide + 10MP Telephoto (3x Optical) | 8K Video Recording',
      },
      {
        name: 'Memory and Storage',
        value: '12GB LPDDR5X High-Speed RAM | 256GB / 512GB UFS 4.0 High-Speed NVMe Storage (Non-expandable)',
      },
      {
        name: 'Battery and Charging',
        value: '5,000mAh Dual-Cell Lithium-Ion Battery | 45W Super Fast Wired Charging (65% in 30 mins) | 15W Fast Wireless Charging & Wireless PowerShare',
      },
      {
        name: 'Build and Durability',
        value: 'Aerospace-Grade Grade 5 Titanium Frame | IP68 Water and Dust Resistance (1.5m submerged up to 30 mins) | Scratch-Resistant Matte Finish Back Glass',
      },
      {
        name: 'Connectivity and OS',
        value: '5G Sub-6/mmWave + Wi-Fi 7 (802.11be) + Bluetooth 5.3 + Ultra-Wideband (UWB) | USB Type-C 3.2 Gen 2 (DisplayPort output) | 7 Years of OS & Security Upgrades',
      },
    ];
  }

  // ==========================================
  // 4. SMARTWATCH SPECIMEN GENERATOR
  // ==========================================
  if (isWatch) {
    return [
      {
        name: 'Display and Case',
        value: '1.4" Always-On Super AMOLED Display (450x450, 330 PPI) | Sapphire Crystal Glass | Armor Aluminum / Titanium Unibody Chassis with Rotating Bezel',
      },
      {
        name: 'Health and Biometric Sensors',
        value: 'BioActive Sensor: Optical Heart Rate + Electrical Heart Signal (ECG) + Bioelectrical Impedance Analysis (BIA) | Skin Temperature Sensor | Continuous SpO2 Sleep Tracking',
      },
      {
        name: 'Battery and Power',
        value: '590mAh High-Capacity Battery | Up to 80 Hours Battery Life (Standard Mode), 100 Hours (Power Saving) | WPC Inductive Fast Wireless Charging',
      },
      {
        name: 'Durability and Resistance',
        value: 'MIL-STD-810H Military Standard Certified | 5ATM + IP68 Water Resistance (Safe for swimming up to 50 meters) | Dust-Tight Encapsulation',
      },
      {
        name: 'Connectivity and Software',
        value: 'Dual-Frequency GPS (L1+L5) + Bluetooth 5.3 + Wi-Fi 2.4/5GHz + NFC Contactless Payment | Wearable OS with Automated Emergency Crash & Fall Detection',
      },
    ];
  }

  // ==========================================
  // 5. GENERAL CONSUMER ELECTRONICS GENERATOR
  // ==========================================
  return [
    {
      name: 'Performance Architecture',
      value: 'High-Efficiency Multi-Stage Power Architecture | Certified Electromagnetic Shielding | Precision Heat Dissipation Channels',
    },
    {
      name: 'Build and Materials',
      value: 'Aerospace-Grade Matte Finish Enclosure | Reinforced Shock-Absorbing Internal Framing | Compact Lightweight Form Factor',
    },
    {
      name: 'Power and Efficiency',
      value: 'Universal Auto-Switching Input Voltage (100V-240V, 50/60Hz) | Energy Star & RoHS Certified Eco-Efficiency | Over-voltage & Short-Circuit Safety Circuitry',
    },
    {
      name: 'Connectivity and Expansion',
      value: 'Universal High-Speed USB Interface | Plug-and-Play Driverless Compatibility across Windows, macOS, Linux, and Android',
    },
  ];
}

/**
 * Formats the consolidated specifications into the exact Website Display Format:
 *
 * PRODUCT SPECIFICATIONS
 * • Processor: [details]
 * • Display: [details]
 * • Memory and Storage: [details]
 * • OS and Software: [details]
 * • Design: [details]
 */
export function formatSpecificationsForAffiliate(
  specifications: ProductSpecification[] = []
): string {
  if (!specifications || specifications.length === 0) {
    return 'PRODUCT SPECIFICATIONS\n\n• Technical specifications currently being verified.';
  }

  const lines = ['PRODUCT SPECIFICATIONS', ''];
  for (const s of specifications) {
    lines.push(`• ${s.name}: ${s.value}`);
  }
  return lines.join('\n\n');
}
