import React, { useState } from 'react';
import {
  Check,
  Edit3,
  Star,
  ExternalLink,
  ShieldAlert,
  Tag,
  Layers,
  Sparkles,
  Code,
  Copy,
  X,
  ShieldCheck,
} from 'lucide-react';
import { AmazonProduct } from '../../types';
import { SUPPORTED_MARKETPLACES } from '../../lib/amazon';

interface ProductPreviewCardProps {
  product: AmazonProduct;
  onConfirm: () => void;
  onEdit: () => void;
  isConfirmed: boolean;
}

export const ProductPreviewCard: React.FC<ProductPreviewCardProps> = ({
  product,
  onConfirm,
  onEdit,
  isConfirmed,
}) => {
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const marketplaceMeta = SUPPORTED_MARKETPLACES[product.marketplace] || {
    flag: '🌐',
    name: 'Amazon',
    domain: 'amazon.com',
  };

  const renderOrUnavailable = (val: string | number | undefined, suffix = '') => {
    if (val !== undefined && val !== null && val !== '') {
      return `${val}${suffix}`;
    }
    return <span className="italic text-slate-400">Not specified</span>;
  };

  const masterJsonString = JSON.stringify(
    product.master_extraction || {
      product: {
        name: product.product_name,
        brand: product.brand,
        model: product.model || 'Not specified',
        model_number: product.model_number || 'Not specified',
        asin: product.asin,
        category: product.category,
        variant: product.variant || 'Not specified',
      },
      specifications: Object.fromEntries(
        (product.specifications || []).map((s) => [
          s.name.toLowerCase().replace(/[\s/&-]+/g, '_'),
          s.value,
        ])
      ),
      marketing_highlights: product.marketing_highlights || product.key_features || [],
      source: {
        source_type: 'Amazon',
        source_url: product.amazon_url,
        data_confidence: product.data_confidence || 'High',
      },
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(masterJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const confidenceBadge = () => {
    const level = product.data_confidence || 'High';
    if (level === 'High') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>High Confidence</span>
        </span>
      );
    }
    if (level === 'Medium') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Medium Confidence</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
        <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
        <span>Low Confidence</span>
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isConfirmed
          ? 'border-emerald-200 bg-white shadow-sm ring-2 ring-emerald-500/20'
          : 'border-orange-200 bg-orange-50/20 shadow-sm'
      } p-6 sm:p-7`}
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
            2
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Product Information Preview</h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Master Extractor
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Verified product baseline data for AI content generation (Zero-Hallucination)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {confidenceBadge()}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <span>{marketplaceMeta.flag}</span>
            <span>{marketplaceMeta.name}</span>
          </span>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800">
            ASIN: {product.asin || 'N/A'}
          </span>
          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Inspect Master Specification JSON"
          >
            <Code className="h-3 w-3 text-slate-500" />
            <span>Master JSON</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Product Image Column */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 md:col-span-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
              className="h-48 w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
              <Layers className="h-8 w-8 text-slate-300" />
              <span className="mt-2">No Image Provided</span>
            </div>
          )}
          <a
            href={product.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-orange-600"
          >
            <span>View on {marketplaceMeta.domain}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Product Details Column */}
        <div className="space-y-4 md:col-span-8">
          <div>
            <h4 className="text-lg font-bold leading-snug text-slate-900">
              {product.product_name || (
                <span className="italic text-slate-400">Not specified</span>
              )}
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>
                <strong>Brand:</strong> {renderOrUnavailable(product.brand)}
              </span>
              <span>
                <strong>Model:</strong> {renderOrUnavailable(product.model)}
              </span>
              {product.model_number && (
                <span>
                  <strong>Model #:</strong> {renderOrUnavailable(product.model_number)}
                </span>
              )}
              <span>
                <strong>Category:</strong> {renderOrUnavailable(product.category)}
              </span>
              {product.variant && (
                <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                  <strong>Variant:</strong> {product.variant}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Rating Badge Row */}
          <div className="flex flex-wrap items-center gap-3 border-y border-slate-100 py-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-900">
              <Tag className="h-4 w-4 text-orange-600" />
              <span>Price:</span>
              <span>{renderOrUnavailable(product.price)}</span>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>
                {product.rating ? `${product.rating} / 5` : 'Not specified'}
              </span>
              {product.review_count && (
                <span className="text-amber-700">({product.review_count.toLocaleString()} ratings)</span>
              )}
            </div>
          </div>

          {/* Marketing Highlights Preview (Section 9 Separation) */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Marketing Highlights ({product.key_features?.length || 0})
            </span>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              {(product.key_features || []).slice(0, 4).map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span className="line-clamp-2">{feat}</span>
                </li>
              ))}
              {(product.key_features?.length || 0) === 0 && (
                <li className="italic text-slate-400">Not specified</li>
              )}
            </ul>
          </div>

          {/* Extracted Technical Specifications Table */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Technical Specifications ({product.specifications.length})
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Zero Hallucination
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-200/60">
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="py-2 px-3 font-bold text-slate-800 w-1/4 align-top">
                          {spec.name}
                        </td>
                        <td className="py-2 px-3 text-slate-700 w-3/4 leading-relaxed font-mono text-[11.5px]">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          <span>Factual baseline confirmed. Single source of structured product facts.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Product Information
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all ${
              isConfirmed
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-orange-600 shadow-orange-600/20 hover:bg-orange-700'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            {isConfirmed ? 'Product Confirmed ✓' : 'Confirm Product Information'}
          </button>
        </div>
      </div>

      {/* Master Specification JSON Modal (Section 12 Inspector) */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Master Extractor JSON Output (Section 12 Schema)
                </h3>
                <p className="text-xs text-slate-500">
                  Structured product extraction output adhering strictly to zero-hallucination rules
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-400">
              <pre>{masterJsonString}</pre>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="text-xs text-slate-500">
                Confidence: <span className="font-bold text-slate-700">{product.data_confidence || 'High'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedJson ? 'Copied to Clipboard!' : 'Copy Section 12 JSON'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

