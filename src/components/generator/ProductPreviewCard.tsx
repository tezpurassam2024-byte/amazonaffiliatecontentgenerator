import React from 'react';
import {
  Check,
  Edit3,
  Star,
  ExternalLink,
  ShieldAlert,
  Tag,
  Layers,
  Sparkles,
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
  const marketplaceMeta = SUPPORTED_MARKETPLACES[product.marketplace] || {
    flag: '🌐',
    name: 'Amazon',
    domain: 'amazon.com',
  };

  const renderOrUnavailable = (val: string | number | undefined, suffix = '') => {
    if (val !== undefined && val !== null && val !== '') {
      return `${val}${suffix}`;
    }
    return <span className="italic text-slate-400">Information not available.</span>;
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
            <h3 className="text-base font-bold text-slate-900">Product Information Preview</h3>
            <p className="text-xs text-slate-500">
              Verified product baseline data for AI content generation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <span>{marketplaceMeta.flag}</span>
            <span>{marketplaceMeta.name}</span>
          </span>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800">
            ASIN: {product.asin || 'N/A'}
          </span>
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
                <span className="italic text-slate-400">Information not available.</span>
              )}
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span>
                <strong>Brand:</strong> {renderOrUnavailable(product.brand)}
              </span>
              <span>
                <strong>Model:</strong> {renderOrUnavailable(product.model)}
              </span>
              <span>
                <strong>Category:</strong> {renderOrUnavailable(product.category)}
              </span>
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
                {product.rating ? `${product.rating} / 5` : 'Information not available.'}
              </span>
              {product.review_count && (
                <span className="text-amber-700">({product.review_count.toLocaleString()} ratings)</span>
              )}
            </div>
          </div>

          {/* Key Features Preview */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Highlights ({product.key_features?.length || 0})
            </span>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              {(product.key_features || []).slice(0, 4).map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span className="line-clamp-2">{feat}</span>
                </li>
              ))}
              {(product.key_features?.length || 0) === 0 && (
                <li className="italic text-slate-400">Information not available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          <span>Factual baseline confirmed. No fabricated test results or reviews.</span>
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
    </div>
  );
};
