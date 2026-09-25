import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  X,
  ExternalLink,
  Star,
  Check,
  Tag,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { AmazonProduct, GeneratedArticleContent } from '../../types';
import { buildAffiliateUrl } from '../../lib/amazon';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: AmazonProduct;
  content: GeneratedArticleContent;
  affiliateTag?: string;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  product,
  content,
  affiliateTag,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  if (!isOpen) return null;

  const title =
    content.seo_titles?.selected ||
    content.seo_titles?.options?.[0] ||
    product.product_name;
  const affiliateUrl = buildAffiliateUrl(
    product.amazon_url,
    product.asin,
    product.marketplace,
    affiliateTag
  );
  const review = content.review || ({} as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">Live Reader Article Preview</span>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
              Realistic Publisher Layout
            </span>
          </div>

          {/* Desktop / Mobile Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                device === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                device === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <div
            className={`mx-auto rounded-2xl bg-white p-6 shadow-sm transition-all sm:p-10 ${
              device === 'mobile'
                ? 'max-w-sm border-4 border-slate-800 shadow-xl'
                : 'max-w-3xl border border-slate-200'
            }`}
          >
            {/* Publisher Site Mock Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 text-xs text-slate-400">
              <span className="font-bold tracking-wider uppercase text-slate-700">
                TechReviewHub
              </span>
              <span>Updated: {new Date().toLocaleDateString()}</span>
            </div>

            {/* Affiliate Disclosure Banner */}
            {content.affiliate_disclosure && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                <p>
                  <strong>Affiliate Disclosure:</strong> {content.affiliate_disclosure}
                </p>
              </div>
            )}

            {/* Article Heading */}
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>

            {/* Featured Hero Image */}
            {(content.images?.hero?.url || product.image_url) && (
              <figure className="my-6">
                <img
                  src={content.images?.hero?.url || product.image_url}
                  alt={content.images?.hero?.alt_text || content.image_seo?.alt_text || product.product_name}
                  className="max-h-80 w-full rounded-xl object-contain bg-slate-50 p-2"
                />
                {(content.images?.hero?.caption || content.image_seo?.caption) && (
                  <figcaption className="mt-2 text-center text-xs italic text-slate-500">
                    {content.images?.hero?.caption || content.image_seo?.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Introduction */}
            {review.introduction && (
              <div className="prose prose-slate my-4 text-sm leading-relaxed text-slate-700">
                <p>{review.introduction}</p>
              </div>
            )}

            {/* Primary Buy CTA Box */}
            <div className="my-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4 sm:flex-row">
              <div>
                <p className="text-xs font-bold text-orange-900">{product.product_name}</p>
                <p className="text-xs text-slate-600">
                  Price: {product.price || 'Check Current Price'} • Verified Amazon Partner
                </p>
              </div>
              <a
                href={affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition-all hover:bg-orange-600 active:scale-95"
              >
                <span>Check Price on Amazon</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Key Features Section */}
            {review.key_features && (
              <div className="my-6">
                <h2 className="text-lg font-bold text-slate-900">Key Features & Highlights</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{review.key_features}</p>
                {content.images?.features?.url && (
                  <figure className="my-4">
                    <img
                      src={content.images.features.url}
                      alt={content.images.features.alt_text || 'Key Features'}
                      className="max-h-72 w-full rounded-xl object-contain bg-slate-50 p-2"
                    />
                    {content.images.features.caption && (
                      <figcaption className="mt-2 text-center text-xs italic text-slate-500">
                        {content.images.features.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            )}

            {/* Design & Build */}
            {review.design_and_build && (
              <div className="my-6">
                <h2 className="text-lg font-bold text-slate-900">Design and Build Quality</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {review.design_and_build}
                </p>
              </div>
            )}

            {/* Performance & Usage */}
            {review.performance_usage && (
              <div className="my-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Performance & Everyday Experience
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {review.performance_usage}
                </p>
              </div>
            )}

            {/* Pros and Cons Visual Box */}
            {(content.pros_cons?.pros?.length || content.pros_cons?.cons?.length) && (
              <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    What We Like (Pros)
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-700">
                    {(content.pros_cons?.pros || []).map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Considerations (Cons)
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-700">
                    {(content.pros_cons?.cons || []).map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 h-3.5 w-3.5 shrink-0 text-center font-bold text-rose-600">
                          ✕
                        </span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications Table */}
            {product.specifications?.length > 0 && (
              <div className="my-6 overflow-x-auto">
                <h2 className="text-lg font-bold text-slate-900">Technical Specifications</h2>
                <table className="mt-3 w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                      <th className="py-2.5 px-3 font-semibold">Specification</th>
                      <th className="py-2.5 px-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-medium text-slate-900">{spec.name}</td>
                        <td className="py-2 px-3 text-slate-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* FAQs */}
            {content.faqs && content.faqs.length > 0 && (
              <div className="my-6">
                <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {content.faqs.map((faq, i) => (
                    <div key={i} className="p-3.5">
                      <p className="text-xs font-bold text-slate-900">{faq.question}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Verdict & Summary CTA */}
            {review.final_verdict && (
              <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <h2 className="text-lg font-bold text-slate-900">Final Editorial Verdict</h2>
                {content.images?.verdict?.url && (
                  <figure className="my-4">
                    <img
                      src={content.images.verdict.url}
                      alt={content.images.verdict.alt_text || 'Final Verdict'}
                      className="max-h-72 w-full rounded-xl object-contain bg-white p-2 border border-slate-200 mx-auto"
                    />
                    {content.images.verdict.caption && (
                      <figcaption className="mt-2 text-center text-xs italic text-slate-500">
                        {content.images.verdict.caption}
                      </figcaption>
                    )}
                  </figure>
                )}
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{review.final_verdict}</p>
                <div className="mt-5">
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-orange-600"
                  >
                    <span>View {product.product_name} on Amazon</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
