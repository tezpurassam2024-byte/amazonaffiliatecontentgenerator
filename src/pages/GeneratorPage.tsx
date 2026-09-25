import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  AmazonProduct,
  ContentGenerationOptions,
  GeneratedArticleContent,
  ComparisonProduct,
  Article,
  ArticleStatus,
} from '../types';
import { ProductInputModal } from '../components/generator/ProductInputModal';
import { ProductPreviewCard } from '../components/generator/ProductPreviewCard';
import { ModulesSelector } from '../components/generator/ModulesSelector';
import { GenerationSettingsPanel } from '../components/generator/GenerationSettingsPanel';
import { ComparisonBuilder } from '../components/generator/ComparisonBuilder';
import { GeneratedContentTabs } from '../components/generator/GeneratedContentTabs';
import { QualityScoreCard } from '../components/generator/QualityScoreCard';
import { LivePreviewModal } from '../components/generator/LivePreviewModal';
import { ExportModal } from '../components/generator/ExportModal';
import { calculateQualityScore } from '../lib/quality-score';
import { localDb } from '../lib/convex';
import { AdSlot } from '../components/common/AdSlot';

interface GeneratorPageProps {
  initialProduct?: AmazonProduct | null;
  onArticleSaved?: (article: Article) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({
  initialProduct = null,
  onArticleSaved,
}) => {
  const [product, setProduct] = useState<AmazonProduct | null>(initialProduct);
  const [isProductConfirmed, setIsProductConfirmed] = useState(false);
  const [extraComparisonProducts, setExtraComparisonProducts] = useState<ComparisonProduct[]>([]);

  const [options, setOptions] = useState<ContentGenerationOptions>({
    modules: {
      seo_title: true,
      review: true,
      pros_cons: true,
      specifications: true,
      comparison: true,
      faq: true,
      meta_title: true,
      meta_description: true,
      image_caption: true,
      schema_markup: true,
      affiliate_disclosure: true,
      social_media: true,
    },
    review_length: '1000',
    writing_style: 'Professional',
    target_audience: 'General consumers',
    seo_intensity: 'Standard SEO',
    keywords: {
      primary: '',
      secondary: [],
      long_tail: [],
    },
    affiliate_tag: localDb.getUser().amazon_associate_tag || 'affiliate-20',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedArticleContent | null>(null);
  const [articleStatus, setArticleStatus] = useState<ArticleStatus>('Generated');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleProductSelected = (prod: AmazonProduct) => {
    setProduct(prod);
    setIsProductConfirmed(true);
    setOptions((prev) => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        primary: prod.product_name,
      },
    }));
  };

  const handleGenerate = async () => {
    if (!product) {
      alert('Please enter or confirm a product first.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/.netlify/functions/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          options,
          extraComparisonProducts,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Content generation request failed.');
      }

      setGeneratedContent(result.data);
      setArticleStatus('Generated');
      localDb.incrementGenerationCount();
      localDb.addLog('info', `Generated affiliate content package for "${product.product_name}"`);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerationError(
        err.message ||
          'Failed to communicate with AI generation engine. Please check GEMINI_API_KEY environment variable.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArticle = () => {
    if (!product || !generatedContent) return;
    setIsSaving(true);

    const user = localDb.getUser();
    const article: Article = {
      id: `art_${Date.now()}`,
      user_id: user.id,
      product,
      title:
        generatedContent.seo_titles?.selected ||
        generatedContent.seo_titles?.options?.[0] ||
        product.product_name,
      content: generatedContent,
      options,
      status: articleStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localDb.saveArticle(article);
    if (onArticleSaved) onArticleSaved(article);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const qualityScore =
    generatedContent && product
      ? calculateQualityScore(generatedContent, options)
      : null;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner */}
      <div className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Amazon Content Studio
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Affiliate Content Package Generator
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Transform verified Amazon product data into 12 structured, high-converting review
                sections
              </p>
            </div>

            {product && (
              <button
                type="button"
                onClick={() => {
                  setProduct(null);
                  setGeneratedContent(null);
                  setIsProductConfirmed(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start New Product
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Step 1: Input Modal */}
        {!product && (
          <ProductInputModal onProductSelected={handleProductSelected} isLoading={isGenerating} />
        )}

        {/* Step 2: Product Confirmation Card */}
        {product && (
          <ProductPreviewCard
            product={product}
            onConfirm={() => setIsProductConfirmed(true)}
            onEdit={() => setIsProductConfirmed(false)}
            isConfirmed={isProductConfirmed}
          />
        )}

        {/* Configuration Steps (Only active once product is confirmed) */}
        {product && isProductConfirmed && (
          <>
            {/* Step 3: Modules Selection */}
            <ModulesSelector options={options} onChange={setOptions} />

            {/* Step 4: AI Settings & Keywords */}
            <GenerationSettingsPanel
              options={options}
              onChange={setOptions}
              defaultAssociateTag={options.affiliate_tag}
            />

            {/* Step 5: Competitor Comparison Builder (Optional) */}
            <ComparisonBuilder
              products={extraComparisonProducts}
              onChange={setExtraComparisonProducts}
              mainProductName={product.product_name}
            />

            {/* Error Message if Generation Fails */}
            {generationError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
                <div className="flex items-center gap-2 font-bold text-rose-950">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  Generation Error
                </div>
                <p className="mt-1">{generationError}</p>
              </div>
            )}

            {/* Step 6: Primary Generation Button */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50/70 to-white p-8 text-center shadow-xs">
              <h3 className="text-lg font-bold text-slate-900">Ready to Generate Package</h3>
              <p className="mt-1 max-w-md text-xs text-slate-600">
                Gemini 3.8 will synthesize your verified product specs with anti-hallucination rules
                into an exhaustive, high-converting review suite.
              </p>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-5 flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Generating 12 Modules with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Generate Affiliate Content</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Results Section */}
        {generatedContent && product && (
          <div className="space-y-8">
            {/* Save Notification */}
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Article successfully saved to database! Access it anytime in My Articles.</span>
              </div>
            )}

            {/* Quality Scorecard */}
            {qualityScore && <QualityScoreCard score={qualityScore} />}

            {/* Generated Content Workspace */}
            <GeneratedContentTabs
              product={product}
              content={generatedContent}
              options={options}
              status={articleStatus}
              onUpdateContent={setGeneratedContent}
              onStatusChange={setArticleStatus}
              onSave={handleSaveArticle}
              onOpenPreview={() => setIsPreviewOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              isSaving={isSaving}
            />

            {/* Article bottom AdSlot placeholder */}
            <AdSlot placement="article-bottom" />
          </div>
        )}
      </div>

      {/* Live Preview Modal */}
      {product && generatedContent && (
        <LivePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          product={product}
          content={generatedContent}
          affiliateTag={options.affiliate_tag}
        />
      )}

      {/* Export Modal */}
      {product && generatedContent && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          product={product}
          content={generatedContent}
          affiliateTag={options.affiliate_tag}
        />
      )}
    </div>
  );
};
