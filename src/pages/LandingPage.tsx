import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  Star,
  FileText,
  Search,
  Check,
  TrendingUp,
  Share2,
  ExternalLink,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SUPPORTED_MARKETPLACES } from '../lib/amazon';
import { AmazonProduct } from '../types';
import { AdSlot } from '../components/common/AdSlot';

interface LandingPageProps {
  onStartGenerator: (presetProduct?: AmazonProduct) => void;
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartGenerator,
  onNavigate,
}) => {
  const [demoUrl, setDemoUrl] = useState('');
  const [demoActiveSample, setDemoActiveSample] = useState<AmazonProduct>(SAMPLE_PRODUCTS[0]);

  const handleRunDemo = () => {
    onStartGenerator(demoActiveSample);
  };

  return (
    <div className="bg-white">
      {/* Monetization / AdSlot Header Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <AdSlot placement="header" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-3.5 py-1.5 text-xs font-semibold text-orange-800 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-orange-600" />
              <span>Next-Gen Editorial AI for Amazon Associates</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn Any Amazon Product URL Into{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
                SEO-Ready Affiliate Content
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Generate product reviews, SEO titles, specifications, comparisons, FAQs, schema
              markup, affiliate disclosures and social media content in minutes.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onStartGenerator()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:bg-orange-700 active:scale-95 sm:w-auto"
              >
                <Zap className="h-4 w-4" />
                <span>Generate Content</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('features')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 sm:w-auto"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Anti-Hallucination Controls
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 10 Amazon Marketplaces
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-emerald-600" /> Netlify & Convex Ready
              </span>
            </div>
          </div>

          {/* Interactive Homepage Demo Card */}
          <div className="mt-12 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-xl sm:p-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Interactive Live Demo
              </span>
              <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Try it with a sample product right now
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Pick a verified sample or paste an Amazon URL to see the generated package
              </p>
            </div>

            {/* Sample Selector Pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SAMPLE_PRODUCTS.map((prod) => {
                const isSelected = demoActiveSample.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setDemoActiveSample(prod);
                      setDemoUrl(prod.amazon_url);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border border-orange-500 bg-white text-orange-950 shadow-sm ring-2 ring-orange-500/20'
                        : 'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{SUPPORTED_MARKETPLACES[prod.marketplace]?.flag}</span>
                    <span className="font-bold">{prod.brand}</span>
                    <span className="text-slate-500">— {prod.model || prod.product_name.slice(0, 24)}</span>
                  </button>
                );
              })}
            </div>

            {/* Demo Product Preview Bar */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:p-5">
              <div className="flex items-center gap-4">
                <img
                  src={demoActiveSample.image_url}
                  alt={demoActiveSample.product_name}
                  className="h-16 w-16 rounded-xl object-contain bg-slate-50 p-1"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {demoActiveSample.product_name}
                  </h4>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{demoActiveSample.price}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      ★ {demoActiveSample.rating} ({demoActiveSample.review_count?.toLocaleString()} reviews)
                    </span>
                    <span>•</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono">
                      ASIN: {demoActiveSample.asin}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunDemo}
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-700 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Sample Content</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Workflow
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              From Amazon URL to Published Article in 3 Steps
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Designed specifically for affiliate bloggers and content marketing teams
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-700">
                1
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Enter Amazon Product URL</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Paste any product link from 10 Amazon marketplaces. The system automatically
                extracts the ASIN, verifies marketplace region, or provides a manual fallback form.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-700">
                2
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">AI Generates 12 Modules</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Gemini constructs an exhaustive content package: SEO titles, 1,000-word review,
                pros & cons, specs, comparisons, FAQs, meta tags, schema JSON-LD, and social posts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-700">
                3
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Refine, Preview & Export</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Polish copy with 1-click AI refiners (Shorten, Expand, Make More Human), preview on
                mobile/desktop, and download clean Markdown, HTML, or WordPress Gutenberg blocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Modules Feature Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              The Complete Content Stack
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              12 High-Converting Modules in Every Generation
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: '5 SEO Title Options',
                desc: '50-65 character click-worthy titles balancing buyer intent and keyword volume.',
              },
              {
                title: '1,000+ Word Editorial Review',
                desc: 'Structured with Introduction, Design, Performance, Who Should Buy, and Verdict.',
              },
              {
                title: 'Factual Pros & Cons',
                desc: 'Grounded solely in verified product specs without fabricated limitations.',
              },
              {
                title: 'Technical Specification Table',
                desc: 'Clean structured comparison data ready for quick reader scanning.',
              },
              {
                title: 'Product Comparison Matrix',
                desc: 'Compare against up to 4 competitor models across category-vital features.',
              },
              {
                title: '8-10 Buyer FAQs',
                desc: 'Directly addresses real consumer doubts and hesitations before purchasing.',
              },
              {
                title: 'Meta Titles & Descriptions',
                desc: 'Formatted to Google snippet character limits (60 / 160 characters).',
              },
              {
                title: 'Image Alt Texts & Captions',
                desc: 'Descriptive, accessible alt text without unnatural keyword stuffing.',
              },
              {
                title: 'JSON-LD Schema Markup',
                desc: 'Valid Product, Review, and FAQPage schemas to win rich snippets in search results.',
              },
              {
                title: 'Amazon Affiliate Disclosure',
                desc: 'Conspicuous, compliant disclosure adhering to FTC and Associates rules.',
              },
              {
                title: 'Social Media Pack',
                desc: 'Tailored posts for X/Twitter threads, Facebook, LinkedIn, Instagram, and Pinterest.',
              },
              {
                title: 'Multi-Format One-Click Export',
                desc: 'Direct copy and file download for Markdown, clean HTML, TXT, and WordPress.',
              },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-xs font-bold text-orange-700">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{feature.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-content Monetization AdSlot */}
      <div className="mx-auto max-w-4xl px-4">
        <AdSlot placement="in-content" />
      </div>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-tr from-slate-900 via-slate-900 to-orange-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Start Generating High-Converting Affiliate Content Today
          </h2>
          <p className="mt-4 text-sm text-slate-300">
            Free tier includes 5 complete article packages every month. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onStartGenerator()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-600/30 hover:bg-orange-500 active:scale-95"
            >
              <Zap className="h-4 w-4" />
              <span>Launch Content Generator Now</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('appointment')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              <Calendar className="h-4 w-4 text-orange-400" />
              <span>Book Strategy Call</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
