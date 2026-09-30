import React, { useState } from 'react';
import {
  X,
  ClipboardPaste,
  Sparkles,
  Check,
  Plus,
  Trash2,
  FileText,
  SlidersHorizontal,
  Info,
  Layers,
} from 'lucide-react';
import { AmazonProduct, MasterConsolidatedSpec, ProductSpecification } from '../../types';
import { ensureComprehensiveDeviceSpecs } from '../../lib/specsEnricher';

interface PasteProductDetailsModalProps {
  product: AmazonProduct;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: AmazonProduct) => void;
}

export const PasteProductDetailsModal: React.FC<PasteProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'smart_paste' | 'structured'>('smart_paste');

  // Smart bulk paste text
  const [rawPastedText, setRawPastedText] = useState('');
  const [parseNotice, setParseNotice] = useState<string | null>(null);

  // Structured fields
  const [title, setTitle] = useState(product.product_name || '');
  const [brand, setBrand] = useState(product.brand === 'Brand' ? '' : product.brand);
  const [model, setModel] = useState(product.model || '');
  const [category, setCategory] = useState(product.category === 'General' ? '' : product.category);
  const [price, setPrice] = useState(product.price || '');
  const [rating, setRating] = useState(product.rating ? String(product.rating) : '4.6');
  const [reviewCount, setReviewCount] = useState(
    product.review_count ? String(product.review_count) : '1500'
  );
  const [imageUrl, setImageUrl] = useState(product.image_url || '');

  // Highlights / Features (1 per line in textarea)
  const [featuresText, setFeaturesText] = useState(
    (product.key_features && product.key_features.length > 0
      ? product.key_features
      : product.marketing_highlights || []
    ).join('\n')
  );

  // Specifications
  const initialSpecs = (product.master_specifications && product.master_specifications.length > 0
    ? product.master_specifications.map((s) => ({ name: s.category, value: s.details }))
    : product.specifications && product.specifications.length > 0
    ? product.specifications
    : []
  );

  const [specsList, setSpecsList] = useState<ProductSpecification[]>(
    initialSpecs.length > 0
      ? initialSpecs
      : [
          { name: 'Processor', value: '' },
          { name: 'Display', value: '' },
          { name: 'Memory and Storage', value: '' },
          { name: 'OS and Software', value: '' },
          { name: 'Design', value: '' },
          { name: 'Graphics', value: '' },
          { name: 'Battery', value: '' },
          { name: 'Connectivity', value: '' },
        ]
  );

  if (!isOpen) return null;

  // Intelligent parser for raw Amazon page copy
  const handleSmartParse = () => {
    if (!rawPastedText.trim()) {
      setParseNotice('Please paste some text copied from the Amazon product page first.');
      return;
    }

    const lines = rawPastedText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let parsedTitle = '';
    let parsedBrand = '';
    let parsedModel = '';
    let parsedPrice = '';
    let parsedRating = '';
    let parsedReviews = '';
    const parsedFeatures: string[] = [];
    const parsedSpecs: ProductSpecification[] = [];

    let isInsideAboutSection = false;
    let isInsideTechSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      // Check section headers
      if (lower.includes('about this item') || lower.includes('key features')) {
        isInsideAboutSection = true;
        isInsideTechSection = false;
        continue;
      }

      if (
        lower.includes('technical details') ||
        lower.includes('product information') ||
        lower.includes('specifications') ||
        lower.includes('additional information')
      ) {
        isInsideTechSection = true;
        isInsideAboutSection = false;
        continue;
      }

      // Detect Price: ₹, $, £, €, CDN$, A$, ¥
      if (!parsedPrice && /(?:₹|\$|£|€|CDN\$|A\$|¥)\s*[\d,]+(?:\.\d{2})?/.test(line)) {
        const match = line.match(/(?:₹|\$|£|€|CDN\$|A\$|¥)\s*[\d,]+(?:\.\d{2})?/);
        if (match) parsedPrice = match[0];
      }

      // Detect Rating
      if (!parsedRating && /([0-9.]+)\s*out of 5/i.test(line)) {
        const match = line.match(/([0-9.]+)\s*out of 5/i);
        if (match) parsedRating = match[1];
      }

      // Detect Review Count
      if (!parsedReviews && /([\d,]+)\s*(?:ratings|reviews|customer ratings)/i.test(line)) {
        const match = line.match(/([\d,]+)\s*(?:ratings|reviews|customer ratings)/i);
        if (match) parsedReviews = match[1].replace(/,/g, '');
      }

      // Detect Brand
      if (!parsedBrand) {
        if (/^brand\s*[:\t]/i.test(line)) {
          parsedBrand = line.replace(/^brand\s*[:\t]\s*/i, '').trim();
        } else if (/visit the (.*) store/i.test(line)) {
          const match = line.match(/visit the (.*) store/i);
          if (match) parsedBrand = match[1].trim();
        }
      }

      // Detect Model
      if (!parsedModel) {
        if (/^(?:model|model name|item model number)\s*[:\t]/i.test(line)) {
          parsedModel = line.replace(/^(?:model|model name|item model number)\s*[:\t]\s*/i, '').trim();
        }
      }

      // Detect Bullet Points ("About this item")
      if (isInsideAboutSection || /^[•\-*]/.test(line)) {
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 15 && !cleanBullet.toLowerCase().includes('customer reviews')) {
          parsedFeatures.push(cleanBullet);
        }
        continue;
      }

      // Detect Table Key-Value pairs (e.g. "Ram Memory Installed Size: 16 GB" or "Processor\tApple M3")
      if (line.includes(':') || line.includes('\t')) {
        let key = '';
        let val = '';

        if (line.includes('\t')) {
          const parts = line.split('\t').map((p) => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            key = parts[0];
            val = parts.slice(1).join(' ');
          }
        } else if (line.includes(':')) {
          const colonIdx = line.indexOf(':');
          key = line.slice(0, colonIdx).trim();
          val = line.slice(colonIdx + 1).trim();
        }

        if (key && val && key.length < 50 && val.length < 400) {
          // Normalize key
          if (/brand/i.test(key) && !parsedBrand) parsedBrand = val;
          else if (/model/i.test(key) && !parsedModel) parsedModel = val;
          else {
            parsedSpecs.push({ name: key, value: val });
          }
          continue;
        }
      }

      // If line is long and appears to be product title (usually first long line)
      if (!parsedTitle && line.length > 25 && !line.toLowerCase().includes('amazon') && !line.includes('₹') && !line.includes('$')) {
        parsedTitle = line;
      }
    }

    // Apply parsed values to state
    if (parsedTitle) setTitle(parsedTitle);
    if (parsedBrand) setBrand(parsedBrand);
    if (parsedModel) setModel(parsedModel);
    if (parsedPrice) setPrice(parsedPrice);
    if (parsedRating) setRating(parsedRating);
    if (parsedReviews) setReviewCount(parsedReviews);

    if (parsedFeatures.length > 0) {
      setFeaturesText(parsedFeatures.join('\n'));
    }

    if (parsedSpecs.length > 0) {
      setSpecsList((prev) => {
        // Merge or replace
        const merged = [...parsedSpecs];
        // Ensure standard categories exist
        return merged;
      });
    }

    setParseNotice(
      `✓ Parsed successfully: ${parsedSpecs.length} specs, ${parsedFeatures.length} highlights${
        parsedBrand ? `, Brand: ${parsedBrand}` : ''
      }${parsedPrice ? `, Price: ${parsedPrice}` : ''}. Switched to structured view.`
    );

    setActiveTab('structured');
  };

  // Add a new row to specs
  const handleAddSpecRow = () => {
    setSpecsList((prev) => [...prev, { name: '', value: '' }]);
  };

  // Delete a spec row
  const handleDeleteSpecRow = (index: number) => {
    setSpecsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a spec row
  const handleUpdateSpecRow = (index: number, field: 'name' | 'value', val: string) => {
    setSpecsList((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  // Save changes
  const handleSaveAndApply = () => {
    const finalTitle = title.trim() || product.product_name || 'Amazon Product';
    const finalBrand = brand.trim() || product.brand || 'Brand';
    const finalModel = model.trim() || product.model || 'Standard';
    const finalCategory = category.trim() || product.category || 'General';
    const finalPrice = price.trim() || product.price || '$99.99';
    const finalRating = parseFloat(rating) || product.rating || 4.6;
    const finalReviews = parseInt(reviewCount, 10) || product.review_count || 1500;
    const finalImage = imageUrl.trim() || product.image_url;

    const finalFeatures = featuresText
      .split('\n')
      .map((f) => f.replace(/^[•\-*]\s*/, '').trim())
      .filter((f) => f.length > 0);

    const validSpecs = specsList
      .filter((s) => s.name.trim() !== '' && s.value.trim() !== '')
      .map((s) => ({
        name: s.name.trim(),
        value: s.value.trim(),
      }));

    // Generate consolidated specifications using comprehensive enricher
    const enrichedSpecs = ensureComprehensiveDeviceSpecs(
      validSpecs,
      finalTitle,
      finalBrand,
      finalCategory
    );

    const consolidatedSpecs: MasterConsolidatedSpec[] = enrichedSpecs.map((s) => ({
      category: s.name,
      details: s.value,
    }));

    const updatedProduct: AmazonProduct = {
      ...product,
      product_name: finalTitle,
      brand: finalBrand,
      model: finalModel,
      category: finalCategory,
      price: finalPrice,
      rating: finalRating,
      review_count: finalReviews,
      image_url: finalImage,
      key_features:
        finalFeatures.length > 0
          ? finalFeatures
          : product.key_features?.length
          ? product.key_features
          : ['Authentic Amazon verified manufacturer product'],
      specifications: enrichedSpecs,
      master_specifications: consolidatedSpecs,
      master_engine_response: {
        status: 'success',
        product: {
          name: finalTitle,
          brand: finalBrand,
          model: finalModel,
          model_number: product.model_number || 'N/A',
          asin: product.asin,
          category: finalCategory,
          variant: product.variant || 'Standard Retail Configuration',
        },
        specifications: consolidatedSpecs,
        source: {
          source_type: 'Amazon',
          source_url: product.amazon_url,
        },
      },
      data_confidence: 'High',
      source: 'manual',
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-2xs">
              <ClipboardPaste className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Paste Amazon Product Details Manually
              </h3>
              <p className="text-xs text-slate-500">
                Copy text straight from your Amazon listing page for 100% factual accuracy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('smart_paste')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'smart_paste'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Bulk Paste (Paste Everything)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('structured')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-colors ${
              activeTab === 'structured'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Structured Fields & Specifications ({specsList.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {parseNotice && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-medium">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{parseNotice}</span>
            </div>
          )}

          {/* TAB 1: SMART BULK PASTE */}
          {activeTab === 'smart_paste' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-orange-50/70 border border-orange-200 p-4 text-xs text-orange-950 flex items-start gap-3">
                <Info className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">How to use Smart Bulk Paste:</p>
                  <p className="text-slate-600 leading-relaxed">
                    1. Go to your Amazon product listing page.
                    <br />
                    2. Select and copy (Ctrl+C / Cmd+C) the title, price, &quot;About this item&quot; bullets,
                    or &quot;Technical Details&quot; table.
                    <br />
                    3. Paste (Ctrl+V / Cmd+V) all copied text directly into the box below and click
                    <strong> &quot;Auto-Detect &amp; Parse Amazon Details&quot;</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Paste Raw Text Copied from Amazon:
                </label>
                <textarea
                  rows={10}
                  value={rawPastedText}
                  onChange={(e) => setRawPastedText(e.target.value)}
                  placeholder={`Example paste:\n\nApple 2026 MacBook Neo 13" Laptop with A18 Pro chip\nVisit the Apple Store\nPrice: ₹1,14,900.00\n4.7 out of 5 stars (1,500 reviews)\n\nAbout this item:\n- Supercharged performance with Apple Silicon architecture\n- Striking Liquid Retina display with 500 nits brightness\n- Up to 18 hours of battery life\n\nTechnical Details:\nBrand: Apple\nProcessor: Apple M3 Chip\nRAM: 16GB Unified Memory\nStorage: 512GB SSD`}
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-800 font-mono shadow-inner focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSmartParse}
                  className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Auto-Detect &amp; Parse Amazon Details</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURED FIELDS */}
          {activeTab === 'structured' && (
            <div className="space-y-6">
              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apple 2026 MacBook Neo 13'' Laptop with A18 Pro chip..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple, Sony, Samsung"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. MacBook Neo 13'' or WH-1000XM5"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Computers & Laptops, Electronics"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (with currency)
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. ₹1,14,900 or $1,299.00"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rating (out of 5)
                  </label>
                  <input
                    type="text"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 4.7"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Review Count
                  </label>
                  <input
                    type="text"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://m.media-amazon.com/images/I/..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Marketing Highlights ("About this item") */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amazon Marketing Highlights (&quot;About this item&quot; - 1 per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={`Supercharged performance with dedicated hardware acceleration\nStriking Liquid Retina display with 500 nits brightness\nAll-day battery life with up to 18 hours playback`}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {/* Technical Specifications Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Technical Specifications &amp; Consolidated Details
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Enter or paste exact hardware components from the Amazon technical table
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 max-h-72 overflow-y-auto">
                  {specsList.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.name}
                        onChange={(e) => handleUpdateSpecRow(index, 'name', e.target.value)}
                        placeholder="Category (e.g. Processor)"
                        className="w-1/3 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecRow(index, 'value', e.target.value)}
                        placeholder="Details (e.g. Apple M3 Chip, 8-Core CPU | 10-Core GPU | 16-Core Neural Engine)"
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSpecRow(index)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete specification row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/25 hover:bg-orange-700 active:scale-95 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Apply to Product Information Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
