import React from 'react';
import {
  Sparkles,
  FileText,
  Table,
  HelpCircle,
  Code2,
  Share2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

interface FeaturesPageProps {
  onStart: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onStart }) => {
  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Platform Capabilities
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need for High-Converting Amazon Affiliate Content
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Engineered to produce fact-checked, FTC-compliant, Google-friendly reviews in minutes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 space-y-16">
        {/* Feature 1: The 12-Module Suite */}
        <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Complete 12-Module Generation Suite
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Traditional AI tools write repetitive, generic walls of text. AffiGenius generates 12
              distinct editorial components designed to satisfy Google search guidelines and drive
              clicks:
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <strong>5 Click-Optimized SEO Titles</strong> (~50-65 chars)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <strong>500–2,000 Word In-Depth Reviews</strong> with structured subheadings
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <strong>Factual Pros & Cons Matrix</strong> based strictly on verified specs
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <strong>Multi-Product Competitor Comparison Table</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  <strong>8–10 Buyer FAQs & FAQPage Schema</strong>
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <pre className="rounded-xl bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-auto">
              <code>{`{
  "seo_titles": [ ...5 titles... ],
  "review": {
    "introduction": "...",
    "key_features": "...",
    "performance": "Factual analysis...",
    "pros": [ ... ],
    "cons": [ ... ],
    "final_verdict": "..."
  },
  "schema_markup": {
    "product_schema": "<JSON-LD>",
    "faq_schema": "<JSON-LD>"
  }
}`}</code>
            </pre>
          </div>
        </section>

        {/* AdSlot */}
        <AdSlot placement="in-content" />

        {/* Feature 2: Strict Anti-Hallucination Philosophy */}
        <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="text-sm font-bold text-emerald-950">Ethical AI Safeguards in Action</h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-900">
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Never claims &quot;I personally tested this product&quot;
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Never invents non-existent lab benchmarks or battery tests
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Transparently states &quot;Information not available&quot; when missing
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">✓</span> Treats product input as untrusted context (blocks prompt injection)
              </li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Strict Anti-Hallucination & FTC Compliance
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Google&apos;s Helpful Content and product review guidelines penalize fabricated personal
              claims. AffiGenius enforces strict editorial boundaries: it uses objective phrasing
              (&quot;Based on the manufacturer specifications...&quot;) and embeds the required Amazon
              Associates disclosure.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to upgrade your affiliate publishing?</h2>
          <p className="mt-2 text-xs text-slate-400">
            Generate 5 full articles per month on the free tier.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-xs font-bold text-white hover:bg-orange-500"
          >
            <Zap className="h-4 w-4" /> Start Generating Free
          </button>
        </div>
      </div>
    </div>
  );
};
