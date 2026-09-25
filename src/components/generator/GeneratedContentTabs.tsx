import React, { useState } from 'react';
import {
  FileText,
  Type,
  Table,
  HelpCircle,
  Code2,
  Share2,
  ShieldCheck,
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
  Tag,
  CheckSquare,
  Sparkles,
  History,
  RotateCcw,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  AmazonProduct,
  GeneratedArticleContent,
  ContentGenerationOptions,
  ArticleStatus,
} from '../../types';
import { RichEditor } from './RichEditor';
import { ArticleImageSlotCard } from './ArticleImageSlotCard';
import { ProductImageStudio } from './ProductImageStudio';
import { generateFullMarkdown } from '../../lib/export';
import { trackEvent } from '../../lib/analytics';

interface VersionItem {
  id: string;
  label: string;
  timestamp: string;
  content: GeneratedArticleContent;
}

interface GeneratedContentTabsProps {
  product: AmazonProduct;
  content: GeneratedArticleContent;
  options: ContentGenerationOptions;
  status: ArticleStatus;
  onUpdateContent: (updated: GeneratedArticleContent) => void;
  onStatusChange: (status: ArticleStatus) => void;
  onSave: () => void;
  onOpenPreview: () => void;
  onOpenExport: () => void;
  isSaving?: boolean;
}

export const GeneratedContentTabs: React.FC<GeneratedContentTabsProps> = ({
  product,
  content,
  options,
  status,
  onUpdateContent,
  onStatusChange,
  onSave,
  onOpenPreview,
  onOpenExport,
  isSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'review'
    | 'titles'
    | 'images'
    | 'pros_cons'
    | 'specs'
    | 'comparison'
    | 'faq'
    | 'meta_image'
    | 'schema'
    | 'disclosure'
    | 'social'
  >('review');

  const [studioTargetSlot, setStudioTargetSlot] = useState<'hero' | 'features' | 'verdict'>('hero');
  const [showImageSpaces, setShowImageSpaces] = useState<boolean>(true);

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  // Version History State
  const [versions, setVersions] = useState<VersionItem[]>([
    {
      id: 'v_init',
      label: 'Version 1 (Initial Generation)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
    },
  ]);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const handleCreateVersion = () => {
    const nextVerNumber = versions.length + 1;
    const newVer: VersionItem = {
      id: `v_${Date.now()}`,
      label: `Version ${nextVerNumber} (Saved Snapshot)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: JSON.parse(JSON.stringify(content)),
    };
    setVersions([newVer, ...versions]);
    trackEvent('article_saved', { version: `Version ${nextVerNumber}` });
  };

  const handleRestoreVersion = (ver: VersionItem) => {
    onUpdateContent(JSON.parse(JSON.stringify(ver.content)));
    trackEvent('version_restored', { version: ver.label });
    setIsVersionModalOpen(false);
  };

  const handleDeleteVersion = (id: string) => {
    setVersions(versions.filter((v) => v.id !== id));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    trackEvent('copy_clicked', { item: id });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleCopyEntire = () => {
    const fullMd = generateFullMarkdown(product, content, options.affiliate_tag);
    handleCopy(fullMd, 'entire_article');
  };

  const handleRegenerateIndividualSection = async (sectionKey: string) => {
    if (regeneratingSection) return;
    setRegeneratingSection(sectionKey);

    try {
      const res = await fetch('/.netlify/functions/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sectionKey,
          product,
          options,
        }),
      });

      const data = await res.json();
      if (data.success && data.sectionData) {
        onUpdateContent({
          ...content,
          [sectionKey]: data.sectionData,
        });
        trackEvent('section_regenerated', { section: sectionKey });
      } else {
        alert(data.error || 'Failed to regenerate section.');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with generation endpoint.');
    } finally {
      setRegeneratingSection(null);
    }
  };

  const selectedTitle =
    content.seo_titles?.selected ||
    content.seo_titles?.options?.[0] ||
    product.product_name;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      {/* Top Workspace Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Content Generated
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Status:</span>
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value as ArticleStatus)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-800"
              >
                <option value="Draft">Draft</option>
                <option value="Generated">Generated</option>
                <option value="Edited">Edited</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{selectedTitle}</h2>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEntire}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95"
          >
            {copiedItem === 'entire_article' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied Article!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy Entire Article
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95"
          >
            <Eye className="h-3.5 w-3.5 text-orange-600" /> Preview
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" /> Export
          </button>

          <button
            type="button"
            onClick={() => setIsVersionModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95"
            title="View or restore versions"
          >
            <History className="h-3.5 w-3.5 text-indigo-600" />
            <span>History ({versions.length})</span>
          </button>

          <button
            type="button"
            onClick={handleCreateVersion}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 active:scale-95"
            title="Create version snapshot"
          >
            <Plus className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-orange-600/20 hover:bg-orange-700 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save to Convex'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-6 scrollbar-none">
        <button
          onClick={() => setActiveTab('review')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'review'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Product Review
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'images'
              ? 'border-orange-600 text-orange-700 bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI Image Studio
          {(content.images?.hero?.url || content.images?.features?.url || content.images?.verdict?.url) && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('titles')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'titles'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="h-3.5 w-3.5" /> SEO Titles (5)
        </button>

        <button
          onClick={() => setActiveTab('pros_cons')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'pros_cons'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="h-3.5 w-3.5" /> Pros & Cons
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'specs'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="h-3.5 w-3.5" /> Specifications
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'comparison'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="h-3.5 w-3.5" /> Comparison Matrix
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'faq'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" /> FAQs ({content.faqs?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('meta_image')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'meta_image'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" /> Meta & Image SEO
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'schema'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" /> Schema JSON-LD
        </button>

        <button
          onClick={() => setActiveTab('disclosure')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'disclosure'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Affiliate Disclosure
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold transition-all ${
            activeTab === 'social'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Share2 className="h-3.5 w-3.5" /> Social Media Posts
        </button>
      </div>

      {/* Active Tab Content Area */}
      <div className="p-6">
        {/* Tab 1: Product Review Editor with Designated Image Spaces */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            {/* Designated Article Image Spaces Section */}
            <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-5 shadow-xs">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Designated Image Spaces in Review
                    </h3>
                    <p className="text-xs text-slate-500">
                      Paste image URLs or generate copyright-free studio visuals. Images automatically render in reader preview and export files.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStudioTargetSlot('hero');
                      setActiveTab('images');
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-xs hover:bg-orange-600 active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Open AI Image Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImageSpaces(!showImageSpaces)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {showImageSpaces ? 'Collapse Spaces' : 'Expand Spaces'}
                  </button>
                </div>
              </div>

              {showImageSpaces && (
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <ArticleImageSlotCard
                    slotId="hero"
                    label="1. Hero Image Space"
                    description="Appears directly under article headline"
                    slotData={content.images?.hero}
                    productName={product.product_name}
                    defaultImageUrl={product.image_url}
                    onUpdateSlot={(updated) =>
                      onUpdateContent({
                        ...content,
                        images: {
                          ...(content.images || {}),
                          hero: updated,
                        },
                      })
                    }
                    onOpenStudio={(slot) => {
                      setStudioTargetSlot(slot);
                      setActiveTab('images');
                    }}
                  />

                  <ArticleImageSlotCard
                    slotId="features"
                    label="2. Key Features Space"
                    description="Appears inside the Features section"
                    slotData={content.images?.features}
                    productName={product.product_name}
                    defaultImageUrl={product.image_url}
                    onUpdateSlot={(updated) =>
                      onUpdateContent({
                        ...content,
                        images: {
                          ...(content.images || {}),
                          features: updated,
                        },
                      })
                    }
                    onOpenStudio={(slot) => {
                      setStudioTargetSlot(slot);
                      setActiveTab('images');
                    }}
                  />

                  <ArticleImageSlotCard
                    slotId="verdict"
                    label="3. Final Verdict Space"
                    description="Appears with the concluding summary"
                    slotData={content.images?.verdict}
                    productName={product.product_name}
                    defaultImageUrl={product.image_url}
                    onUpdateSlot={(updated) =>
                      onUpdateContent({
                        ...content,
                        images: {
                          ...(content.images || {}),
                          verdict: updated,
                        },
                      })
                    }
                    onOpenStudio={(slot) => {
                      setStudioTargetSlot(slot);
                      setActiveTab('images');
                    }}
                  />
                </div>
              )}
            </div>

            {/* Review Article Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Full Article Editor ({options.review_length}-Word Review)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit directly or use the AI action buttons (Improve, Shorten, Expand, Make More
                    Human, SEO Boost)
                  </p>
                </div>
              </div>

              <RichEditor
                value={content.raw_markdown || generateFullMarkdown(product, content, options.affiliate_tag)}
                onChange={(newVal) =>
                  onUpdateContent({
                    ...content,
                    raw_markdown: newVal,
                  })
                }
                productName={product.product_name}
                writingStyle={options.writing_style}
                keywords={[options.keywords.primary, ...options.keywords.secondary]}
              />
            </div>
          </div>
        )}

        {/* Tab: AI Image Studio */}
        {activeTab === 'images' && (
          <ProductImageStudio
            product={product}
            content={content}
            onUpdateContent={onUpdateContent}
            preselectedSlot={studioTargetSlot}
          />
        )}

        {/* Tab 2: SEO Titles */}
        {activeTab === 'titles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  SEO-Optimized Titles (5 Options)
                </h3>
                <p className="text-xs text-slate-500">
                  Recommended 50–65 characters. Click any title to set it as the primary article
                  title.
                </p>
              </div>

              <button
                type="button"
                disabled={regeneratingSection === 'seo_titles'}
                onClick={() => handleRegenerateIndividualSection('seo_titles')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
              >
                <RotateCcw className={`h-3.5 w-3.5 text-orange-600 ${regeneratingSection === 'seo_titles' ? 'animate-spin' : ''}`} />
                <span>{regeneratingSection === 'seo_titles' ? 'Regenerating...' : 'Regenerate Titles'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(content.seo_titles?.options || [product.product_name]).map((t, idx) => {
                const isSelected = (content.seo_titles?.selected || selectedTitle) === t;
                const charLen = t.length;
                const isIdealLength = charLen >= 50 && charLen <= 65;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      onUpdateContent({
                        ...content,
                        seo_titles: {
                          selected: t,
                          options: content.seo_titles?.options || [t],
                        },
                      })
                    }
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t}</p>
                        <span
                          className={`text-[11px] font-medium ${
                            isIdealLength ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          {charLen} characters {isIdealLength ? '(Ideal length)' : ''}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(t, `title_${idx}`);
                      }}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      {copiedItem === `title_${idx}` ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Pros & Cons */}
        {activeTab === 'pros_cons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pros & Cons Breakdown</h3>
                <p className="text-xs text-slate-500">
                  Derived solely from actual verified product data without artificial drawbacks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={regeneratingSection === 'pros_cons'}
                  onClick={() => handleRegenerateIndividualSection('pros_cons')}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
                >
                  <RotateCcw className={`h-3.5 w-3.5 text-orange-600 ${regeneratingSection === 'pros_cons' ? 'animate-spin' : ''}`} />
                  <span>{regeneratingSection === 'pros_cons' ? 'Regenerating...' : 'Regenerate'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `### Pros\n` +
                        (content.pros_cons?.pros || []).map((p) => `- ${p}`).join('\n') +
                        `\n\n### Cons\n` +
                        (content.pros_cons?.cons || []).map((c) => `- ${c}`).join('\n'),
                      'pros_cons'
                    )
                  }
                  className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copiedItem === 'pros_cons' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy Table
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Pros / Advantages ({(content.pros_cons?.pros || []).length})
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {(content.pros_cons?.pros || []).map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-800">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Cons / Limitations ({(content.pros_cons?.cons || []).length})
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {(content.pros_cons?.cons || []).map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-800">
                      <span className="mt-0.5 h-4 w-4 shrink-0 font-bold text-rose-600">✕</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Product Specifications Table</h3>
                <p className="text-xs text-slate-500">
                  Only displaying verified fields for which reliable data is available
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `| Specification | Detail |\n| --- | --- |\n` +
                      (product.specifications || [])
                        .map((s) => `| ${s.name} | ${s.value} |`)
                        .join('\n'),
                    'specs_table'
                  )
                }
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copiedItem === 'specs_table' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy Markdown
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-bold">Attribute</th>
                    <th className="py-3 px-4 font-bold">Specification Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(product.specifications || []).map((spec, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{spec.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{spec.value}</td>
                    </tr>
                  ))}
                  {(!product.specifications || product.specifications.length === 0) && (
                    <tr>
                      <td colSpan={2} className="py-4 text-center italic text-slate-400">
                        No custom specifications supplied.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Comparison Table */}
        {activeTab === 'comparison' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Category Comparison Matrix & Verdict
                </h3>
                <p className="text-xs text-slate-500">
                  Relevant category attributes compared side-by-side
                </p>
              </div>
              <button
                type="button"
                disabled={regeneratingSection === 'comparison'}
                onClick={() => handleRegenerateIndividualSection('comparison')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
              >
                <RotateCcw className={`h-3.5 w-3.5 text-orange-600 ${regeneratingSection === 'comparison' ? 'animate-spin' : ''}`} />
                <span>{regeneratingSection === 'comparison' ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </div>

            {content.comparison ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                      <th className="py-3 px-4 font-bold">Product</th>
                      <th className="py-3 px-4 font-bold">Price</th>
                      <th className="py-3 px-4 font-bold">Rating</th>
                      <th className="py-3 px-4 font-bold">Key Distinction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-orange-50/40">
                      <td className="py-3 px-4 font-bold text-orange-950">
                        ★ {product.product_name} (Main)
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {product.price || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{product.rating}★</td>
                      <td className="py-3 px-4 text-slate-600">
                        {product.key_features?.[0] || 'Primary Focus'}
                      </td>
                    </tr>
                    {(content.comparison.comparison_products || []).map((cp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{cp.name}</td>
                        <td className="py-3 px-4 text-slate-600">{cp.price || 'Check Amazon'}</td>
                        <td className="py-3 px-4 text-slate-600">{cp.rating || '4.5'}★</td>
                        <td className="py-3 px-4 text-slate-600">
                          {Object.values(cp.attributes || {})[0] || 'Competitor Alternative'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {content.comparison.verdict && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4">
                    <span className="text-xs font-bold text-slate-900">Comparison Verdict: </span>
                    <span className="text-xs text-slate-700">{content.comparison.verdict}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                Comparison section not generated. Select Comparison in module options to generate.
              </div>
            )}
          </div>
        )}

        {/* Tab 6: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Frequently Asked Questions ({content.faqs?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Targeting real buyer hesitations and common questions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={regeneratingSection === 'faqs'}
                  onClick={() => handleRegenerateIndividualSection('faqs')}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
                >
                  <RotateCcw className={`h-3.5 w-3.5 text-orange-600 ${regeneratingSection === 'faqs' ? 'animate-spin' : ''}`} />
                  <span>{regeneratingSection === 'faqs' ? 'Regenerating...' : 'Regenerate FAQs'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      (content.faqs || [])
                        .map((f) => `### ${f.question}\n${f.answer}`)
                        .join('\n\n'),
                      'faqs_list'
                    )
                  }
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {copiedItem === 'faqs_list' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy FAQs
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {(content.faqs || []).map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">
                      Q{idx + 1}: {faq.question}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(`**${faq.question}**\n${faq.answer}`, `faq_${idx}`)
                      }
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedItem === `faq_${idx}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Meta & Image SEO */}
        {activeTab === 'meta_image' && (
          <div className="space-y-6">
            {/* Meta Titles */}
            <div>
              <h3 className="text-sm font-bold text-slate-900">Meta Titles (Target 50-60 Chars)</h3>
              <div className="mt-2 space-y-2">
                {(content.meta_titles || []).map((mt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{mt}</p>
                      <span className="text-[10px] text-slate-400">{mt.length} chars</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(mt, `meta_title_${i}`)}
                      className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                    >
                      {copiedItem === `meta_title_${i}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Descriptions */}
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Meta Descriptions (Target 140-160 Chars)
              </h3>
              <div className="mt-2 space-y-2">
                {(content.meta_descriptions || []).map((md, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                  >
                    <div>
                      <p className="text-xs text-slate-800">{md}</p>
                      <span className="text-[10px] text-slate-400">{md.length} chars</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(md, `meta_desc_${i}`)}
                      className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                    >
                      {copiedItem === `meta_desc_${i}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Image SEO */}
            {content.image_seo && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="text-xs font-bold text-slate-900">Image Caption & Alt Text</h4>
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Alt Text: </span>
                    <span className="text-slate-800">{content.image_seo.alt_text}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Caption: </span>
                    <span className="text-slate-800">{content.image_seo.caption}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Short Description: </span>
                    <span className="text-slate-800">{content.image_seo.short_description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Schema Markup */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  JSON-LD Schema Markup (Product & FAQ)
                </h3>
                <p className="text-xs text-slate-500">
                  Validated against schema.org specifications without fabricated reviews or ratings
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(content.schema_markup?.product_schema || '{}', 'schema_code')
                }
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700"
              >
                {copiedItem === 'schema_code' ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied Schema!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Schema
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-96 overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-emerald-400">
              <code>{content.schema_markup?.product_schema || '// No schema generated'}</code>
            </pre>
          </div>
        )}

        {/* Tab 9: Affiliate Disclosure */}
        {activeTab === 'disclosure' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Amazon Affiliate Disclosure</h3>
              <p className="text-xs text-slate-500">
                Required by Amazon Associates Operating Agreement & FTC endorsement regulations
              </p>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Compliance Reminder
              </div>
              <p className="mt-1">
                Amazon Associates terms require publishers to clearly post a statement such as: &quot;As
                an Amazon Associate I earn from qualifying purchases.&quot; Always place this disclosure
                conspicuously before the first affiliate link in your article.
              </p>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={content.affiliate_disclosure || ''}
                onChange={(e) =>
                  onUpdateContent({
                    ...content,
                    affiliate_disclosure: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed text-slate-800 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  handleCopy(content.affiliate_disclosure || '', 'disclosure_text')
                }
                className="absolute top-3 right-3 rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50"
              >
                {copiedItem === 'disclosure_text' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 10: Social Media Posts */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Multi-Platform Social Media Posts
                </h3>
                <p className="text-xs text-slate-500">
                  Ready-to-post promotional copy tailored for each platform
                </p>
              </div>

              <button
                type="button"
                disabled={regeneratingSection === 'social_media'}
                onClick={() => handleRegenerateIndividualSection('social_media')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
              >
                <RotateCcw className={`h-3.5 w-3.5 text-orange-600 ${regeneratingSection === 'social_media' ? 'animate-spin' : ''}`} />
                <span>{regeneratingSection === 'social_media' ? 'Regenerating...' : 'Regenerate Posts'}</span>
              </button>
            </div>

            {/* X / Twitter */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">𝕏 / Twitter Posts (3 Options)</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {(content.social_media?.twitter || []).map((tw, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-800"
                  >
                    <p className="flex-1 whitespace-pre-wrap">{tw}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(tw, `twitter_${idx}`)}
                      className="shrink-0 p-1 text-slate-400 hover:text-slate-700"
                    >
                      {copiedItem === `twitter_${idx}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Facebook */}
            <div className="rounded-xl border border-slate-200 p-4">
              <span className="text-xs font-bold text-slate-900">Facebook Posts (3 Options)</span>
              <div className="mt-3 space-y-2.5">
                {(content.social_media?.facebook || []).map((fb, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-800"
                  >
                    <p className="flex-1 whitespace-pre-wrap">{fb}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(fb, `fb_${idx}`)}
                      className="shrink-0 p-1 text-slate-400 hover:text-slate-700"
                    >
                      {copiedItem === `fb_${idx}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn & Instagram */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-bold text-slate-900">LinkedIn Post</span>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-800">
                  {content.social_media?.linkedin?.[0] || 'No post generated.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-bold text-slate-900">Instagram Caption</span>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-800">
                  {content.social_media?.instagram?.[0] || 'No caption generated.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Version History</h3>
                  <p className="text-xs text-slate-500">
                    View, restore, or manage saved content snapshots
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
              <span className="text-xs text-slate-600 font-medium">Save current state as a snapshot:</span>
              <button
                type="button"
                onClick={handleCreateVersion}
                className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-orange-700"
              >
                <Plus className="h-3.5 w-3.5" /> Save New Snapshot
              </button>
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto space-y-2">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ver.label}</p>
                    <span className="text-[10px] text-slate-400">{ver.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(ver)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Restore
                    </button>
                    {versions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteVersion(ver.id)}
                        className="rounded-lg p-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
