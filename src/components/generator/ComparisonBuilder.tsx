import React, { useState } from 'react';
import { Plus, Trash2, Layers, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { ComparisonProduct } from '../../types';
import { parseAmazonUrl } from '../../lib/amazon';

interface ComparisonBuilderProps {
  products: ComparisonProduct[];
  onChange: (products: ComparisonProduct[]) => void;
  mainProductName: string;
}

export const ComparisonBuilder: React.FC<ComparisonBuilderProps> = ({
  products,
  onChange,
  mainProductName,
}) => {
  const [method, setMethod] = useState<'url' | 'manual'>('manual');
  const [compUrl, setCompUrl] = useState('');
  const [compName, setCompName] = useState('');
  const [compPrice, setCompPrice] = useState('');
  const [compRating, setCompRating] = useState('4.5');

  const handleAddProduct = () => {
    if (products.length >= 4) {
      alert('You can compare against up to 4 competitor products.');
      return;
    }

    if (method === 'url') {
      const parsed = parseAmazonUrl(compUrl);
      if (!parsed.isValid) {
        alert(parsed.error || 'Invalid Amazon URL');
        return;
      }
      const newProd: ComparisonProduct = {
        name: compName.trim() || `Competitor (${parsed.asin})`,
        asin: parsed.asin,
        price: compPrice.trim() || 'Check Amazon',
        rating: parseFloat(compRating) || 4.5,
        attributes: {},
      };
      onChange([...products, newProd]);
      setCompUrl('');
      setCompName('');
    } else {
      if (!compName.trim()) {
        alert('Please enter a product name.');
        return;
      }
      const newProd: ComparisonProduct = {
        name: compName.trim(),
        price: compPrice.trim() || 'Check Amazon',
        rating: parseFloat(compRating) || 4.5,
        attributes: {},
      };
      onChange([...products, newProd]);
      setCompName('');
      setCompPrice('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(products.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Competitor Comparison Table (Optional)
          </h3>
          <p className="text-xs text-slate-500">
            Compare <span className="font-semibold text-slate-800">{mainProductName}</span> against
            up to 4 competitor products
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {products.length} / 4 Competitors Added
        </span>
      </div>

      {/* List of currently added comparison products */}
      {products.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-500">
                  Price: {item.price} • Rating: {item.rating}★
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="rounded p-1 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {products.length < 4 && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <span>Add Competitor via:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="compMethod"
                checked={method === 'manual'}
                onChange={() => setMethod('manual')}
                className="text-orange-600"
              />
              Manual Details
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="compMethod"
                checked={method === 'url'}
                onChange={() => setMethod('url')}
                className="text-orange-600"
              />
              Amazon URL
            </label>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {method === 'url' ? (
              <div className="sm:col-span-2">
                <input
                  type="url"
                  placeholder="Paste competitor Amazon URL..."
                  value={compUrl}
                  onChange={(e) => setCompUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Competitor Product Name (e.g. Bose QuietComfort 45)..."
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Price (e.g. $329)"
                value={compPrice}
                onChange={(e) => setCompPrice(e.target.value)}
                className="w-1/2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
