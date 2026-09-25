import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { ArticleImageSlot } from '../../types';

interface ArticleImageSlotCardProps {
  slotId: 'hero' | 'features' | 'verdict';
  label: string;
  description: string;
  slotData?: ArticleImageSlot;
  productName: string;
  defaultImageUrl?: string;
  onUpdateSlot: (updated: ArticleImageSlot | undefined) => void;
  onOpenStudio?: (slotId: 'hero' | 'features' | 'verdict') => void;
}

export const ArticleImageSlotCard: React.FC<ArticleImageSlotCardProps> = ({
  slotId,
  label,
  description,
  slotData,
  productName,
  defaultImageUrl,
  onUpdateSlot,
  onOpenStudio,
}) => {
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const hasImage = Boolean(slotData?.url);

  const handleApplyUrl = () => {
    if (!pastedUrl.trim()) return;
    onUpdateSlot({
      id: slotId,
      label,
      url: pastedUrl.trim(),
      caption: slotData?.caption || `${productName} presentation view`,
      alt_text: slotData?.alt_text || `${productName} review photo`,
    });
    setPastedUrl('');
    setIsUrlInputOpen(false);
  };

  const handleUseDefaultImage = () => {
    if (!defaultImageUrl) return;
    onUpdateSlot({
      id: slotId,
      label,
      url: defaultImageUrl,
      caption: `${productName} official product image`,
      alt_text: `${productName} Amazon product view`,
    });
  };

  const handleDownload = () => {
    if (!slotData?.url) return;
    const a = document.createElement('a');
    a.href = slotData.url;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${slotId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyMarkdown = () => {
    if (!slotData?.url) return;
    const alt = slotData.alt_text || productName;
    const md = `![${alt}](${slotData.url})\n*${slotData.caption || ''}*`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = () => {
    onUpdateSlot(undefined);
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{label}</h4>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>

        {hasImage && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
              title="Download Image"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
              title="Copy Markdown Code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Markdown'}</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100"
              title="Remove Image"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {!hasImage ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <ImageIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Designated Space for {label}</p>
          <p className="mt-0.5 max-w-sm text-xs text-slate-500">
            Generate a copyright-free product visual or paste any product image URL to display directly in the published review.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {onOpenStudio && (
              <button
                type="button"
                onClick={() => onOpenStudio(slotId)}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm transition-all hover:bg-orange-600 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate in AI Studio</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Paste Image URL</span>
            </button>

            {defaultImageUrl && (
              <button
                type="button"
                onClick={handleUseDefaultImage}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Use Amazon Image</span>
              </button>
            )}
          </div>

          {isUrlInputOpen && (
            <div className="mt-4 flex w-full max-w-md items-center gap-2">
              <input
                type="url"
                value={pastedUrl}
                onChange={(e) => setPastedUrl(e.target.value)}
                placeholder="https://example.com/product-image.jpg"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      ) : slotData && slotData.url ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <div className="group relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
              <img
                src={slotData.url}
                alt={slotData.alt_text || productName}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-3 sm:col-span-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Image Caption (Visible in Article)</label>
              <input
                type="text"
                value={slotData.caption || ''}
                onChange={(e) =>
                  onUpdateSlot({
                    id: slotId,
                    label,
                    url: slotData.url,
                    alt_text: slotData.alt_text,
                    caption: e.target.value,
                  })
                }
                placeholder="e.g. Side angle view showing sleek matte finish"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">SEO Alt Text (Accessibility & Search Ranking)</label>
              <input
                type="text"
                value={slotData.alt_text || ''}
                onChange={(e) =>
                  onUpdateSlot({
                    id: slotId,
                    label,
                    url: slotData.url,
                    caption: slotData.caption,
                    alt_text: e.target.value,
                  })
                }
                placeholder="e.g. Sony WH-1000XM5 wireless noise cancelling headphones on stand"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              {onOpenStudio && (
                <button
                  type="button"
                  onClick={() => onOpenStudio(slotId)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate in Studio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
