import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Search,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AmazonProduct, MarketplaceId, ProductSpecification } from '../../types';
import { parseAmazonUrl, SAMPLE_PRODUCTS, SUPPORTED_MARKETPLACES } from '../../lib/amazon';

interface ProductInputModalProps {
  onProductSelected: (product: AmazonProduct) => void;
  isLoading?: boolean;
}

export const ProductInputModal: React.FC<ProductInputModalProps> = ({
  onProductSelected,
  isLoading = false,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);

  // Manual form state
  const [manualName, setManualName] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualCategory, setManualCategory] = useState('Electronics');
  const [manualPrice, setManualPrice] = useState('');
  const [manualRating, setManualRating] = useState<number>(4.5);
  const [manualReviewCount, setManualReviewCount] = useState<number>(120);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualProductUrl, setManualProductUrl] = useState('');
  const [manualAsin, setManualAsin] = useState('');
  const [manualMarketplace, setManualMarketplace] = useState<MarketplaceId>('com');
  const [manualDescription, setManualDescription] = useState('');

  const [features, setFeatures] = useState<string[]>([
    'High quality premium build and ergonomic materials',
    'Advanced energy efficient battery performance',
    'Intuitive controls with wide compatibility',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const [specs, setSpecs] = useState<ProductSpecification[]>([
    { name: 'Brand', value: '' },
    { name: 'Model', value: '' },
    { name: 'Color', value: 'Black' },
    { name: 'Warranty', value: '1 Year Manufacturer Limited Warranty' },
  ]);

  const handleAnalyzeUrl = async () => {
    setUrlError(null);
    if (!urlInput.trim()) {
      setUrlError('Please enter or paste an Amazon product URL.');
      return;
    }

    const parsed = parseAmazonUrl(urlInput);
    if (!parsed.isValid) {
      setUrlError(parsed.error || 'Invalid Amazon URL format.');
      return;
    }

    // Check if URL matches one of our rich sample products
    const sample = SAMPLE_PRODUCTS.find((p) => p.asin === parsed.asin);
    if (sample) {
      onProductSelected({
        ...sample,
        marketplace: parsed.marketplace || sample.marketplace,
        amazon_url: parsed.cleanedUrl || sample.amazon_url,
      });
      return;
    }

    // Attempt to call the server-side provider endpoint
    try {
      const res = await fetch('/.netlify/functions/get-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        if (data.requiresManualReview || !data.product.product_name) {
          // Switch to manual mode pre-filled with the detected ASIN & marketplace!
          setManualAsin(parsed.asin || 'B0XXXXXX');
          setManualMarketplace(parsed.marketplace || 'com');
          setManualProductUrl(parsed.cleanedUrl || urlInput);
          setIsManualMode(true);
          setUrlError(
            'Amazon ASIN & Marketplace detected! Please provide or confirm product details below.'
          );
        } else {
          onProductSelected(data.product);
        }
      } else {
        throw new Error(data.error || 'Could not fetch product information.');
      }
    } catch {
      // Fallback: switch to manual entry with detected ASIN
      setManualAsin(parsed.asin || '');
      setManualMarketplace(parsed.marketplace || 'com');
      setManualProductUrl(parsed.cleanedUrl || urlInput);
      setIsManualMode(true);
      setUrlError('Marketplace identified. Please complete the product details below.');
    }
  };

  const handleSelectSample = (sample: AmazonProduct) => {
    setUrlInput(sample.amazon_url);
    setUrlError(null);
    onProductSelected(sample);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) {
      alert('Product Name is required.');
      return;
    }

    const filteredSpecs = specs.filter((s) => s.name.trim() && s.value.trim());

    const product: AmazonProduct = {
      id: `manual_${Date.now()}`,
      asin: manualAsin.trim().toUpperCase() || 'CUSTOM101',
      marketplace: manualMarketplace,
      product_name: manualName.trim(),
      brand: manualBrand.trim() || 'Brand Not Specified',
      model: manualModel.trim() || undefined,
      category: manualCategory.trim() || 'General',
      price: manualPrice.trim() || undefined,
      rating: manualRating || undefined,
      review_count: manualReviewCount || undefined,
      image_url:
        manualImageUrl.trim() ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      amazon_url:
        manualProductUrl.trim() ||
        `https://www.amazon.${SUPPORTED_MARKETPLACES[manualMarketplace].domain}/dp/${manualAsin || 'PROD'}`,
      key_features: features.length ? features : ['Information not available.'],
      specifications: filteredSpecs.length
        ? filteredSpecs
        : [{ name: 'Category', value: manualCategory }],
      description: manualDescription.trim() || undefined,
      source: 'manual',
    };

    onProductSelected(product);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" /> Step 1: Input Product
          </span>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Enter Amazon Product URL
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Supports 10 Amazon marketplaces (.com, .in, .co.uk, .ca, .de, .fr, .it, .es, .co.jp,
            .com.au)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualMode(!isManualMode)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 transition-colors hover:text-orange-700"
        >
          {isManualMode ? (
            <>
              <ChevronUp className="h-4 w-4" /> Use URL Input
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Enter Product Manually
            </>
          )}
        </button>
      </div>

      {!isManualMode ? (
        <div className="mt-6">
          {/* URL Input Box */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <LinkIcon className="h-5 w-5" />
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError(null);
              }}
              placeholder="Paste Amazon product URL (e.g. https://www.amazon.com/dp/B09XS7JWHH)..."
              className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-32 text-sm text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <div className="absolute inset-y-1.5 right-1.5 flex items-center">
              <button
                type="button"
                onClick={handleAnalyzeUrl}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-orange-600/30 transition-all hover:bg-orange-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Search className="h-3.5 w-3.5" />
                )}
                Analyze URL
              </button>
            </div>
          </div>

          {urlError && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="flex-1">
                <span>{urlError}</span>
              </div>
            </div>
          )}

          {/* Quick Demo Pre-fill Pills */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500">
              Or test instantly with verified sample products:
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SAMPLE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleSelectSample(prod)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-medium text-slate-700 transition-all hover:border-orange-300 hover:bg-orange-50/50 hover:text-orange-900"
                >
                  <span className="text-base">
                    {SUPPORTED_MARKETPLACES[prod.marketplace]?.flag}
                  </span>
                  <span className="font-semibold text-slate-900">{prod.brand}</span>
                  <span className="text-slate-500">— {prod.model || prod.product_name.slice(0, 20)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Manual Product Fallback Form */
        <form onSubmit={handleManualSubmit} className="mt-6 space-y-5">
          <div className="rounded-xl bg-orange-50/60 p-3.5 text-xs text-orange-950">
            <div className="flex items-center gap-1.5 font-semibold text-orange-800">
              <HelpCircle className="h-4 w-4" /> Compliant Manual Product Entry Fallback
            </div>
            <p className="mt-1 text-slate-600">
              When Amazon PA-API is not configured or for custom review workflows, enter the factual
              specifications here. The AI will strictly respect these attributes without
              hallucinating.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Brand</label>
              <input
                type="text"
                value={manualBrand}
                onChange={(e) => setManualBrand(e.target.value)}
                placeholder="e.g. Sony"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Model / Edition</label>
              <input
                type="text"
                value={manualModel}
                onChange={(e) => setManualModel(e.target.value)}
                placeholder="e.g. WH-1000XM5"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Category</label>
              <input
                type="text"
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                placeholder="e.g. Over-Ear Headphones"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Price (Listed)</label>
              <input
                type="text"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="e.g. $398.00"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={manualRating}
                onChange={(e) => setManualRating(parseFloat(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Review Count</label>
              <input
                type="number"
                value={manualReviewCount}
                onChange={(e) => setManualReviewCount(parseInt(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">ASIN</label>
              <input
                type="text"
                value={manualAsin}
                onChange={(e) => setManualAsin(e.target.value.toUpperCase())}
                placeholder="e.g. B09XS7JWHH"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Marketplace</label>
              <select
                value={manualMarketplace}
                onChange={(e) => setManualMarketplace(e.target.value as MarketplaceId)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              >
                {Object.values(SUPPORTED_MARKETPLACES).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.flag} {m.name} ({m.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">Product Image URL</label>
              <input
                type="url"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">Amazon Product URL</label>
              <input
                type="url"
                value={manualProductUrl}
                onChange={(e) => setManualProductUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Key Features Bullet Builder */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-semibold text-slate-800">
              Key Features / Manufacturer Highlights
            </label>
            <div className="mt-2 space-y-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="flex-1 text-xs text-slate-700">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add another feature bullet point..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Specifications Table Builder */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                Specifications (Key / Value)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Battery Life"
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                    className="w-1/3 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Up to 30 hours"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700"
            >
              <CheckCircle2 className="h-4 w-4" /> Save & Preview Product Data
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
