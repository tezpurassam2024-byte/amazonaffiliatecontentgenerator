import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  ClipboardPaste,
} from 'lucide-react';
import {
  AmazonProduct,
  GeneratedArticleContent,
  GeneratedProductImage,
  ArticleImageSlot,
} from '../../types';
import { requestProductImage } from '../../lib/clientImageGenerator';

interface ProductImageStudioProps {
  product: AmazonProduct;
  content: GeneratedArticleContent;
  onUpdateContent: (updated: GeneratedArticleContent) => void;
  preselectedSlot?: 'hero' | 'features' | 'verdict';
}

const STYLE_PRESETS = [
  {
    id: 'clean_studio',
    label: 'Clean Studio White',
    desc: 'Pure commercial backdrop, clean soft shadow, high conversion',
    color: 'from-slate-100 to-white',
    badge: 'Amazon Standard',
  },
  {
    id: 'luxury_dark',
    label: 'Luxury Dark Pedestal',
    desc: 'Deep graphite cylinder, cybernetic blue rim light, sleek tech feel',
    color: 'from-slate-900 to-slate-800 text-white',
    badge: 'Premium Flagship',
  },
  {
    id: 'lifestyle_desk',
    label: 'Modern Lifestyle',
    desc: 'Warm wooden surfaces, soft morning ambient light, cozy desk setup',
    color: 'from-amber-50 to-orange-100',
    badge: 'Editorial Favorite',
  },
  {
    id: 'minimalist_pastel',
    label: 'Minimalist Pastel',
    desc: 'Aesthetic lilac & soft lavender tones, contemporary creative studio',
    color: 'from-purple-50 to-pink-50',
    badge: 'Social Ready',
  },
  {
    id: 'outdoor_natural',
    label: 'Outdoor & Natural',
    desc: 'Organic greens, natural textures, fresh eco-lifestyle atmosphere',
    color: 'from-emerald-50 to-green-100',
    badge: 'Outdoor / Fitness',
  },
];

export const ProductImageStudio: React.FC<ProductImageStudioProps> = ({
  product,
  content,
  onUpdateContent,
  preselectedSlot = 'hero',
}) => {
  const [sourceImageUrl, setSourceImageUrl] = useState<string>(product.image_url || '');
  const [selectedStyle, setSelectedStyle] = useState<string>('clean_studio');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9'>('1:1');
  const [targetSlot, setTargetSlot] = useState<'hero' | 'features' | 'verdict'>(preselectedSlot);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activeGeneratedImage, setActiveGeneratedImage] = useState<GeneratedProductImage | null>(
    content.gallery && content.gallery.length > 0 ? content.gallery[content.gallery.length - 1] : null
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image'))) {
        setSourceImageUrl(text);
      }
    } catch (e) {
      console.warn('Clipboard read permission denied', e);
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const newImage = await requestProductImage({
        imageUrl: sourceImageUrl.trim() || undefined,
        productName: product.product_name,
        brand: product.brand,
        category: product.category,
        style: selectedStyle,
        aspectRatio,
        customPrompt: customPrompt.trim() || undefined,
      });

      setActiveGeneratedImage(newImage);

      // Add to gallery
      const existingGallery = content.gallery || [];
      const updatedGallery = [newImage, ...existingGallery];

      // Auto-assign to target slot if selected
      let updatedImages = { ...(content.images || {}) };
      if (targetSlot) {
        const slotLabel =
          targetSlot === 'hero'
            ? 'Hero Product Image'
            : targetSlot === 'features'
            ? 'Key Features In-Action'
            : 'Final Verdict & Summary';

        updatedImages[targetSlot] = {
          id: targetSlot,
          label: slotLabel,
          url: newImage.url,
          caption: `${product.product_name} - ${STYLE_PRESETS.find((s) => s.id === selectedStyle)?.label || 'Studio View'}`,
          alt_text: `${product.product_name} by ${product.brand} official affiliate review presentation`,
        };
        setAssignedSuccess(`Assigned to ${slotLabel}!`);
        setTimeout(() => setAssignedSuccess(null), 3000);
      }

      onUpdateContent({
        ...content,
        gallery: updatedGallery,
        images: updatedImages,
      });
    } catch (err: any) {
      console.error('Image generation failed:', err);
      setGenerationError(err.message || 'Image generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imgUrl: string, nameSuffix = 'studio') => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `${product.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nameSuffix}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAssignToSlot = (slot: 'hero' | 'features' | 'verdict', image: GeneratedProductImage) => {
    const slotLabel =
      slot === 'hero'
        ? 'Hero Product Image'
        : slot === 'features'
        ? 'Key Features In-Action'
        : 'Final Verdict & Summary';

    const updatedImages = {
      ...(content.images || {}),
      [slot]: {
        id: slot,
        label: slotLabel,
        url: image.url,
        caption: `${product.product_name} - ${image.style || 'Studio Presentation'}`,
        alt_text: `${product.product_name} ${slot} review visual`,
      },
    };

    onUpdateContent({
      ...content,
      images: updatedImages,
    });

    setAssignedSuccess(`Assigned to ${slotLabel}!`);
    setTimeout(() => setAssignedSuccess(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-orange-100/60 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-slate-950 font-bold">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                AI Product Studio & Image Generator
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Copyright-Free Output
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              Transform product image URLs into high-converting, commercial-ready studio visuals for your affiliate review. Every generated visual is 100% royalty-free, downloadable, and automatically placed in designated article spaces.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Auto-Insert Into:</span>
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setTargetSlot('hero')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  targetSlot === 'hero' ? 'bg-orange-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hero Slot
              </button>
              <button
                type="button"
                onClick={() => setTargetSlot('features')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  targetSlot === 'features' ? 'bg-orange-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Features Slot
              </button>
              <button
                type="button"
                onClick={() => setTargetSlot('verdict')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  targetSlot === 'verdict' ? 'bg-orange-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verdict Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {assignedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4" />
          <span>{assignedSuccess} View it in the "Full Review" tab.</span>
        </div>
      )}

      {generationError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{generationError}</span>
        </div>
      )}

      {/* Main Studio Workspace */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Generator Controls */}
        <div className="space-y-6 lg:col-span-5">
          {/* Source Image URL Input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Source Product Image URL
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                <ClipboardPaste className="h-3 w-3" />
                <span>Paste from Clipboard</span>
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Paste any Amazon, manufacturer, or retail image URL to transform into a clean studio visual.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="url"
                value={sourceImageUrl}
                onChange={(e) => setSourceImageUrl(e.target.value)}
                placeholder="https://m.media-amazon.com/images/I/..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden"
              />
              {sourceImageUrl && (
                <button
                  type="button"
                  onClick={() => setSourceImageUrl('')}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {product.image_url && sourceImageUrl !== product.image_url && (
              <button
                type="button"
                onClick={() => setSourceImageUrl(product.image_url || '')}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Use detected Amazon product image</span>
              </button>
            )}

            {sourceImageUrl && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2">
                <img
                  src={sourceImageUrl}
                  alt="Source"
                  className="h-12 w-12 rounded-lg object-contain bg-white p-1 border border-slate-200"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">Source image ready</p>
                  <p className="text-[11px] text-slate-400">Will be enhanced with studio lighting and pedestal</p>
                </div>
              </div>
            )}
          </div>

          {/* Style Presets */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Choose Studio Lighting & Theme
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Select the aesthetic backdrop and pedestal environment.
            </p>

            <div className="mt-3 grid gap-2.5">
              {STYLE_PRESETS.map((preset) => {
                const isSelected = selectedStyle === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedStyle(preset.id)}
                    className={`flex items-start justify-between rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{preset.label}</span>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">{preset.desc}</p>
                    </div>

                    <div
                      className={`h-4 w-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                        isSelected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio & Options */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Framing & Aspect Ratio
              </label>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
              >
                <Sliders className="h-3 w-3" />
                <span>{showAdvanced ? 'Hide Custom Prompt' : 'Custom Prompt'}</span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                  aspectRatio === '1:1'
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-950'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">1:1 Square</span>
                <span className="text-[10px] text-slate-400">1200 x 1200</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('4:3')}
                className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                  aspectRatio === '4:3'
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-950'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">4:3 Product</span>
                <span className="text-[10px] text-slate-400">1200 x 900</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                  aspectRatio === '16:9'
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-950'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">16:9 Banner</span>
                <span className="text-[10px] text-slate-400">1600 x 900</span>
              </button>
            </div>

            {showAdvanced && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <label className="block text-xs font-semibold text-slate-700">Custom Lighting / Scene Prompt</label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Floating in air with soft volumetric golden hour backlight..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-black text-slate-950 shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-98 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Studio Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Copyright-Free Studio Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Result & Actions */}
        <div className="space-y-6 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-orange-600" />
                <h4 className="text-sm font-bold text-slate-900">Studio Output Preview</h4>
              </div>

              {activeGeneratedImage && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(activeGeneratedImage.url, 'highres')}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50">
              {activeGeneratedImage ? (
                <div className="w-full space-y-4">
                  <div className="relative mx-auto flex max-h-[460px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
                    <img
                      src={activeGeneratedImage.url}
                      alt={product.product_name}
                      className="max-h-[420px] w-full rounded-xl object-contain"
                    />

                    <span className="absolute top-5 right-5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      Commercial Ready
                    </span>
                  </div>

                  {/* Slot Insertion Action Bar */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold text-slate-900">One-Click Insert into Article Spaces:</p>
                    <p className="text-[11px] text-slate-500">
                      Instantly place this image inside the review layout for readers and SEO search engines.
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAssignToSlot('hero', activeGeneratedImage)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition-all ${
                          content.images?.hero?.url === activeGeneratedImage.url
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {content.images?.hero?.url === activeGeneratedImage.url ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>Hero Space</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAssignToSlot('features', activeGeneratedImage)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition-all ${
                          content.images?.features?.url === activeGeneratedImage.url
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {content.images?.features?.url === activeGeneratedImage.url ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>Features Space</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAssignToSlot('verdict', activeGeneratedImage)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition-all ${
                          content.images?.verdict?.url === activeGeneratedImage.url
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {content.images?.verdict?.url === activeGeneratedImage.url ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>Verdict Space</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <h4 className="mt-3 text-base font-bold text-slate-900">No Studio Image Generated Yet</h4>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Paste any product image URL or choose a style preset on the left, then click "Generate Copyright-Free Studio Image".
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Session Gallery */}
          {content.gallery && content.gallery.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Session Gallery ({content.gallery.length} Images)
                </h4>
                <span className="text-[11px] text-slate-400">Click any image to preview or re-assign</span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-3">
                {content.gallery.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveGeneratedImage(img)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-slate-50 p-1.5 transition-all ${
                      activeGeneratedImage?.id === img.id
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="aspect-square w-full rounded-lg object-contain bg-white"
                    />
                    <div className="mt-1 truncate text-[10px] font-semibold text-slate-600">
                      {img.style}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
