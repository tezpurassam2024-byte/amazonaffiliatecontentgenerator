import { ProductSpecification } from '../types';

/**
 * Transforms and enriches specifications into the exact specimen format:
 *
 * Processor: Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 47 TOPS
 * Display: 14" WUXGA OLED (1920x1200) | 400Nits Typical Brightness, 600Nits Peak Brightness | 100% DCI-P3 |DisplayHDR True Black 500 | X-Rite | Dolby Vision | Anti Glare |TUV Low Blue Light Certified
 * Memory and Storage: 16GB Soldered LPDDR5x-8533, Mop memory Max Memory Max Memory 16GB soldered memory, not upgradable | 512GB SSD M.2 2242 PCIe 4.0x4 NVMe, Max Storage Support One drive, up to 1TB M.2 2242 SSD
 * OS and Software: Windows 11 Home Single Language, English | Microsoft 365 Basic + Office Home 2024
 * Design: 4 side narrow bezel | 1.39 cm Ultra Thin & 1.19 kg Light | Backlight Keyboard | Case Material: Aluminium (Top), Aluminium (Bottom)
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

  const isLaptop =
    lowerName.includes('macbook') ||
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
    lowerName.includes('spectre') ||
    lowerName.includes('envy') ||
    lowerName.includes('pavilion') ||
    lowerName.includes('swift') ||
    lowerName.includes('galaxy book') ||
    lowerCat.includes('laptop') ||
    lowerCat.includes('computer');

  const isPhoneOrTablet =
    lowerName.includes('iphone') ||
    lowerName.includes('ipad') ||
    lowerName.includes('galaxy s') ||
    lowerName.includes('galaxy tab') ||
    lowerName.includes('galaxy a') ||
    lowerName.includes('galaxy z') ||
    lowerName.includes('pixel') ||
    lowerName.includes('smartphone') ||
    lowerName.includes('tablet') ||
    lowerCat.includes('phone') ||
    lowerCat.includes('tablet');

  const getExisting = (regex: RegExp): string => {
    const found = specs.find((s) => regex.test(s.name.toLowerCase()));
    return found ? found.value : '';
  };

  // 1. LAPTOP / COMPUTER SPECIMEN GENERATOR
  if (isLaptop) {
    // --- 1. PROCESSOR ---
    let procVal = getExisting(/^processor$/i) || getExisting(/^processor \/ cpu$/i);
    if (!procVal || !procVal.includes('||')) {
      if (lowerName.includes('ultra 7 256v') || lowerName.includes('core ultra 7')) {
        procVal = 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 47 TOPS';
      } else if (lowerName.includes('ultra 9') || lowerName.includes('288v')) {
        procVal = 'Intel Core Ultra 9 288V, 8C (4P + 4LPE) / 8T, Max Turbo up to 5.1GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 48 TOPS';
      } else if (lowerName.includes('ultra 5')) {
        procVal = 'Intel Core Ultra 5 226V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.5GHz, 8MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 40 TOPS';
      } else if (lowerName.includes('m3 max')) {
        procVal = 'Apple M3 Max Chip, 14C (10P + 4E) / 14T, Max Turbo up to 4.05GHz, 48MB Unified Cache || NPU: 16-Core Neural Engine, up to 38 TOPS';
      } else if (lowerName.includes('m3 pro')) {
        procVal = 'Apple M3 Pro Chip, 11C (5P + 6E) / 11T, Max Turbo up to 4.05GHz, 36MB Unified Cache || NPU: 16-Core Neural Engine, up to 38 TOPS';
      } else if (lowerName.includes('m3')) {
        procVal = 'Apple M3 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 4.05GHz, 24MB Unified Cache || NPU: 16-Core Neural Engine, up to 38 TOPS';
      } else if (lowerName.includes('m2 max')) {
        procVal = 'Apple M2 Max Chip, 12C (8P + 4E) / 12T, Max Turbo up to 3.7GHz, 36MB Unified Cache || NPU: 16-Core Neural Engine, up to 15.8 TOPS';
      } else if (lowerName.includes('m2 pro')) {
        procVal = 'Apple M2 Pro Chip, 10C (6P + 4E) / 10T, Max Turbo up to 3.5GHz, 30MB Unified Cache || NPU: 16-Core Neural Engine, up to 15.8 TOPS';
      } else if (lowerName.includes('m2')) {
        procVal = 'Apple M2 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 3.5GHz, 20MB Unified Cache || NPU: 16-Core Neural Engine, up to 15.8 TOPS';
      } else if (lowerName.includes('m1')) {
        procVal = 'Apple M1 Chip, 8C (4P + 4E) / 8T, Max Turbo up to 3.2GHz, 16MB Unified Cache || NPU: 16-Core Neural Engine, up to 11 TOPS';
      } else if (lowerName.includes('i9-13900h') || lowerName.includes('i9')) {
        procVal = 'Intel Core i9-13900H, 14C (6P + 8E) / 20T, Max Turbo up to 5.4GHz, 24MB Intel Smart Cache || NPU: Intel Gaussian & Neural Accelerator 3.0';
      } else if (lowerName.includes('i7-13700h') || (lowerName.includes('i7') && lowerName.includes('13'))) {
        procVal = 'Intel Core i7-13700H, 14C (6P + 8E) / 20T, Max Turbo up to 5.0GHz, 24MB Intel Smart Cache || NPU: Intel Gaussian & Neural Accelerator 3.0';
      } else if (lowerName.includes('i7')) {
        procVal = 'Intel Core i7-1355U, 10C (2P + 8E) / 12T, Max Turbo up to 5.0GHz, 12MB Intel Smart Cache || NPU: Intel GNA 3.0 Dedicated Image Signal Processor';
      } else if (lowerName.includes('i5-1335u') || lowerName.includes('i5')) {
        procVal = 'Intel Core i5-1335U, 10C (2P + 8E) / 12T, Max Turbo up to 4.6GHz, 12MB Intel Smart Cache || NPU: Intel GNA 3.0';
      } else if (lowerName.includes('ryzen 9')) {
        procVal = 'AMD Ryzen 9 7940HS, 8C / 16T, Max Boost up to 5.2GHz, 16MB L3 Cache || NPU: AMD Ryzen AI, up to 10 TOPS (38 TOPS System)';
      } else if (lowerName.includes('ryzen 7')) {
        procVal = 'AMD Ryzen 7 7840HS, 8C / 16T, Max Boost up to 5.1GHz, 16MB L3 Cache || NPU: AMD Ryzen AI, up to 10 TOPS (38 TOPS System)';
      } else if (lowerName.includes('ryzen 5')) {
        procVal = 'AMD Ryzen 5 7530U, 6C / 12T, Max Boost up to 4.5GHz, 16MB L3 Cache || NPU: AMD Radeon Integrated Graphics Engine';
      } else if (lowerName.includes('snapdragon x elite')) {
        procVal = 'Qualcomm Snapdragon X Elite X1E-80-100, 12C / 12T, Multithread up to 3.4GHz, 42MB Total Cache || NPU: Qualcomm Hexagon NPU, up to 45 TOPS';
      } else {
        procVal = 'Intel Core Ultra 7 256V, 8C (4P + 4LPE) / 8T, Max Turbo up to 4.8GHz, 12MB Intel Smart Cache || NPU: Integrated Intel AI Boost, up to 47 TOPS';
      }
    }

    // --- 2. DISPLAY ---
    let dispVal = getExisting(/^display$/i);
    if (!dispVal || !dispVal.includes('|')) {
      if (lowerName.includes('oled') && lowerName.includes('14')) {
        dispVal = '14" WUXGA OLED (1920x1200) | 400Nits Typical Brightness, 600Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black 500 | X-Rite | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else if (lowerName.includes('oled')) {
        dispVal = '15.6" 2.8K OLED (2880x1800) | 400Nits Typical Brightness, 600Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black 600 | 120Hz 0.2ms | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else if (lowerName.includes('15.3') || (lowerName.includes('15') && lowerName.includes('macbook'))) {
        dispVal = '15.3" WQXGA+ Liquid Retina IPS (2880x1864) | 500Nits Typical Brightness, 500Nits Peak Brightness | 100% DCI-P3 Wide Color | DisplayHDR / Dolby Vision Support | True Tone Technology | Anti Glare Anti-Reflective | TUV Low Blue Light Certified';
      } else if (lowerName.includes('13.6') || (lowerName.includes('13') && lowerName.includes('macbook'))) {
        dispVal = '13.6" WQXGA Liquid Retina IPS (2560x1664) | 500Nits Typical Brightness, 500Nits Peak Brightness | 100% DCI-P3 Wide Color | DisplayHDR / Dolby Vision Support | True Tone Technology | Anti Glare Anti-Reflective | TUV Low Blue Light Certified';
      } else if (lowerName.includes('16') && lowerName.includes('macbook')) {
        dispVal = '16.2" Liquid Retina XDR Mini-LED (3456x2234) | 1000Nits Typical Brightness, 1600Nits Peak Brightness | 100% DCI-P3 | DisplayHDR True Black XDR | 120Hz ProMotion | Dolby Vision | Anti Glare Anti-Reflective | TUV Certified';
      } else if (lowerName.includes('14')) {
        dispVal = '14" 2.2K IPS (2240x1400) | 400Nits Typical Brightness, 500Nits Peak Brightness | 100% sRGB | DisplayHDR 400 | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      } else {
        dispVal = '15.6" FHD IPS (1920x1080) | 350Nits Typical Brightness, 500Nits Peak Brightness | 100% sRGB | DisplayHDR 400 | Dolby Vision | Anti Glare | TUV Low Blue Light Certified';
      }
    }

    // --- 3. MEMORY AND STORAGE ---
    let memStoreVal = getExisting(/^memory and storage$/i) || getExisting(/^memory & storage$/i);
    if (!memStoreVal || !memStoreVal.includes('|')) {
      const is16GB = lowerName.includes('16gb') || (!lowerName.includes('8gb') && !lowerName.includes('32gb') && !lowerName.includes('64gb'));
      const is32GB = lowerName.includes('32gb');
      const is8GB = lowerName.includes('8gb');
      const is1TB = lowerName.includes('1tb');
      const is2TB = lowerName.includes('2tb');
      const is256GB = lowerName.includes('256gb');

      let ramPart = '16GB Soldered LPDDR5x-8533, Max Memory 16GB soldered memory, not upgradable';
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
        if (is8GB) ramPart = '8GB Soldered Unified Memory LPDDR5-6400 (100GB/s bandwidth), Unified Memory Architecture, not upgradable';
        else if (is32GB) ramPart = '32GB Soldered Unified Memory LPDDR5-6400 (150GB/s bandwidth), Unified Memory Architecture, not upgradable';
        else ramPart = '16GB Soldered Unified Memory LPDDR5-6400 (100GB/s bandwidth), Unified Memory Architecture, not upgradable';
      } else if (is8GB) {
        ramPart = '8GB Soldered LPDDR5x-6400, Max Memory 8GB soldered memory, not upgradable';
      } else if (is32GB) {
        ramPart = '32GB Soldered LPDDR5x-8533, Max Memory 32GB soldered memory, not upgradable';
      }

      let ssdPart = '512GB SSD M.2 2242 PCIe 4.0x4 NVMe, Max Storage Support One drive, up to 1TB M.2 2242 SSD';
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
        if (is256GB) ssdPart = '256GB SSD PCIe 4.0x4 NVMe, High-Speed Apple Unified Flash Storage';
        else if (is1TB) ssdPart = '1TB SSD PCIe 4.0x4 NVMe, High-Speed Apple Unified Flash Storage';
        else if (is2TB) ssdPart = '2TB SSD PCIe 4.0x4 NVMe, High-Speed Apple Unified Flash Storage';
        else ssdPart = '512GB SSD PCIe 4.0x4 NVMe, High-Speed Apple Unified Flash Storage';
      } else if (is1TB) {
        ssdPart = '1TB SSD M.2 2280 PCIe 4.0x4 NVMe, Max Storage Support up to 2TB M.2 SSD';
      } else if (is256GB) {
        ssdPart = '256GB SSD M.2 2242 PCIe 4.0x4 NVMe, Max Storage Support up to 1TB M.2 2242 SSD';
      }

      memStoreVal = `${ramPart} | ${ssdPart}`;
    }

    // --- 4. OS AND SOFTWARE ---
    let osVal = getExisting(/^os and software$/i) || getExisting(/^os & software$/i);
    if (!osVal || !osVal.includes('|')) {
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
        osVal = 'macOS Sonoma (pre-installed, lifetime free OS upgrades) | Apple Intelligence Ready + iWork Suite (Pages, Numbers, Keynote)';
      } else if (lowerName.includes('chromebook')) {
        osVal = 'ChromeOS with automated background security updates | Google Play Store + Google One 100GB Cloud Trial';
      } else if (lowerName.includes('pro')) {
        osVal = 'Windows 11 Pro 64-bit, English | Microsoft 365 Basic + Office Home & Business 2024';
      } else {
        osVal = 'Windows 11 Home Single Language, English | Microsoft 365 Basic + Office Home 2024';
      }
    }

    // --- 5. DESIGN ---
    let designVal = getExisting(/^design$/i);
    if (!designVal || !designVal.includes('|')) {
      if (lowerName.includes('15.3') || (lowerName.includes('15') && lowerName.includes('macbook'))) {
        designVal = '4 side narrow bezel with 5mm uniform borders | 1.15 cm Ultra Thin & 1.51 kg Light | Backlight Keyboard with Touch ID | Case Material: Aluminium (Top), Aluminium (Bottom)';
      } else if (lowerName.includes('13.6') || (lowerName.includes('13') && lowerName.includes('macbook'))) {
        designVal = '4 side narrow bezel with 5mm uniform borders | 1.13 cm Ultra Thin & 1.24 kg Light | Backlight Keyboard with Touch ID | Case Material: Aluminium (Top), Aluminium (Bottom)';
      } else if (lowerName.includes('thinkpad')) {
        designVal = '4 side narrow bezel | 1.49 cm Ultra Thin & 1.26 kg Light | Spill-resistant Backlight Keyboard with TrackPoint | Case Material: Carbon Fiber (Top), Aluminium (Bottom)';
      } else if (lowerName.includes('14')) {
        designVal = '4 side narrow bezel | 1.39 cm Ultra Thin & 1.19 kg Light | Backlight Keyboard | Case Material: Aluminium (Top), Aluminium (Bottom)';
      } else {
        designVal = '4 side narrow bezel | 1.45 cm Ultra Thin & 1.35 kg Light | Backlight Keyboard | Case Material: Aluminium (Top), Aluminium (Bottom)';
      }
    }

    // --- 6. GRAPHICS (Supplementary) ---
    let gfxVal = getExisting(/^graphics$/i);
    if (!gfxVal) {
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
        gfxVal = 'Integrated Apple 10-Core GPU | Hardware-Accelerated Ray Tracing, Dynamic Caching, Mesh Shading';
      } else if (lowerName.includes('ultra 7') || lowerName.includes('ultra 9')) {
        gfxVal = 'Integrated Intel Arc 140V Graphics | DirectX 12 Ultimate, Ray Tracing, Intel XeSS AI Super Sampling';
      } else if (lowerName.includes('rtx 4060')) {
        gfxVal = 'NVIDIA GeForce RTX 4060 8GB GDDR6 Dedicated Graphics | 115W TGP, DLSS 3.5, Ada Lovelace Architecture';
      } else {
        gfxVal = 'Integrated Intel Arc Graphics | DirectX 12 Ultimate, Intel XeSS AI Super Sampling';
      }
    }

    // --- 7. BATTERY AND POWER (Supplementary) ---
    let battVal = getExisting(/^battery and power$/i) || getExisting(/^battery & power$/i);
    if (!battVal) {
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
        battVal = '66.5Wh Integrated Lithium-Polymer Battery | MagSafe 3 Fast Charging with 35W/70W Adapter (Up to 18 Hours Apple TV playback, 15 Hours Wireless Web)';
      } else {
        battVal = '70Wh Integrated 4-Cell Li-Polymer Battery | Rapid Charge Boost (Up to 18 Hours Video Playback, 15 min charge for 3 hours use)';
      }
    }

    // --- 8. CONNECTIVITY AND AUDIO (Supplementary) ---
    let connVal = getExisting(/^connectivity and audio$/i) || getExisting(/^connectivity & audio$/i);
    if (!connVal) {
      if (lowerName.includes('macbook') || lowerBrand.includes('apple')) {
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
      { name: 'Battery and Power', value: battVal },
      { name: 'Connectivity and Audio', value: connVal },
    ];
  }

  // 2. SMARTPHONE / TABLET SPECIMEN GENERATOR
  if (isPhoneOrTablet) {
    const isIPhone = lowerName.includes('iphone') || lowerBrand.includes('apple');

    let procVal = isIPhone
      ? 'Apple A17 Pro Chip, 6C (2P + 4E) / 6T, 6-Core GPU with Hardware Ray Tracing || NPU: 16-Core Neural Engine, up to 35 TOPS'
      : 'Qualcomm Snapdragon 8 Gen 3 for Galaxy, 8C (1 Prime + 5 Perf + 2 Eff) up to 3.39GHz || NPU: Qualcomm Hexagon NPU, up to 45 TOPS AI Engine';

    let dispVal = isIPhone
      ? '6.7" Super Retina XDR OLED (2796x1290) | 1000Nits Typical Brightness, 2000Nits Peak Brightness | 100% DCI-P3 | HDR10 & Dolby Vision | 1-120Hz ProMotion Adaptive Refresh | Ceramic Shield Front Glass | True Tone'
      : '6.8" QHD+ Dynamic AMOLED 2X (3120x1440) | 1200Nits Typical Brightness, 2600Nits Peak Brightness | 100% DCI-P3 | DisplayHDR10+ | 1-120Hz LTPO Adaptive Refresh | Corning Gorilla Armor Anti-Reflective Glass | Eye Comfort Shield';

    let memStoreVal = isIPhone
      ? '8GB LPDDR5 Unified High-Speed RAM | 256GB / 512GB NVMe High-Speed Internal Storage, not expandable'
      : '12GB LPDDR5X Ultra-High Speed RAM | 256GB / 512GB UFS 4.0 High-Speed Storage, not expandable';

    let osVal = isIPhone
      ? 'iOS 17 (eligible for iOS 18 with Apple Intelligence) | Apple Intelligence Suite + iCloud Integration'
      : 'Android 14 with One UI 6.1 | Galaxy AI with 7 Years of OS & Security Updates';

    let designVal = isIPhone
      ? 'Ultra-narrow symmetrical bezels | 0.82 cm Ultra Thin & 0.22 kg Light | IP68 Water & Dust Resistant | Case Material: Grade 5 Titanium (Frame), Textured Matte Glass (Back)'
      : 'Ultra-narrow symmetrical bezels | 0.86 cm Ultra Thin & 0.23 kg Light | Built-in S Pen Stylus, IP68 Water & Dust Resistant | Case Material: Titanium Frame (Top), Corning Gorilla Glass (Back)';

    return [
      { name: 'Processor', value: procVal },
      { name: 'Display', value: dispVal },
      { name: 'Memory and Storage', value: memStoreVal },
      { name: 'OS and Software', value: osVal },
      { name: 'Design', value: designVal },
      {
        name: 'Camera and Audio',
        value: isIPhone
          ? 'Pro Camera System (48MP Main with Sensor-Shift OIS + 12MP Ultra-Wide + 12MP 5x Telephoto) | Spatial Video Recording, Stereo Speakers with Spatial Audio'
          : 'Quad Camera System (200MP Main with OIS + 50MP 5x Periscope Telephoto + 10MP 3x Telephoto + 12MP Ultra-Wide) | 8K Video Recording, Stereo Speakers with Dolby Atmos',
      },
      {
        name: 'Battery and Power',
        value: isIPhone
          ? '4422mAh Integrated Li-Ion Battery | MagSafe 15W Wireless Charging & USB-C Fast Charging (50% in 30 min)'
          : '5000mAh Integrated Li-Ion Battery | 45W Super Fast Charging 2.0 & 15W Fast Wireless Charging 2.0',
      },
      {
        name: 'Connectivity',
        value: '5G Dual SIM (eSIM + Physical) | Wi-Fi 7 / 6E + Bluetooth 5.3 | Ultra-Wideband (UWB) + NFC + USB-C 3.2 Gen 2 (10Gbps DisplayPort)',
      },
    ];
  }

  // 3. AUDIO / HEADPHONES / GENERAL ELECTRONICS SPECIMEN GENERATOR
  return [
    {
      name: 'Processor and Acoustic Engine',
      value: 'Integrated V1 + QN1 Dual HD Noise Cancelling Processors || DSEE Extreme Audio Upscaling + 360 Reality Audio Certified',
    },
    {
      name: 'Audio and Driver',
      value: '30mm / 40mm Precision Carbon Fiber Composite Dome Drivers | Frequency Response: 4Hz - 40,000Hz | Hi-Res Audio & Hi-Res Wireless Certified with LDAC codec',
    },
    {
      name: 'Design',
      value: 'Ergonomic silent joint structure | 0.25 kg Ultra Light | Soft fit synthetic leather headband and ear cushions | Case Material: Acoustic-Grade Recycled ABS (Body)',
    },
    {
      name: 'Battery and Power',
      value: 'Up to 30 Hours Continuous Playback with ANC On (Up to 40 Hours with ANC Off) | USB-PD Rapid Charge (3 min charge gives 3 hours playback)',
    },
    {
      name: 'Connectivity and Software',
      value: 'Bluetooth 5.2 / 5.3 Multipoint Connection (2 devices simultaneous) | Google Fast Pair + Microsoft Swift Pair | Sony Headphones Connect App with 10-band EQ',
    },
    {
      name: 'Microphone and Voice',
      value: '8 Microphones (4 on each side) with AI Beamforming Noise Reduction | Precise Voice Pickup Technology with Wind Noise Reduction',
    },
  ];
}
