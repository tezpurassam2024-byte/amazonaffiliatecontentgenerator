import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white pb-20">
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            About AffiGenius
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built for Serious Affiliate Publishers
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Empowering content creators with ethical, fact-grounded, and high-velocity affiliate
            tooling.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8 space-y-10 text-xs leading-relaxed text-slate-700">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Our Mission</h2>
          <p className="mt-2 text-sm text-slate-600">
            Affiliate publishing is undergoing an editorial renaissance. Search engines increasingly
            demote generic AI content that hallucinates personal product testing or copies
            monotonous bullet points. AffiGenius was engineered from the ground up to synthesize
            factual product information into structured, helpful editorial formats that real
            consumers trust.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">Anti-Hallucination Guardrails</h3>
            <p className="mt-1 text-slate-600">
              Our prompts explicitly prohibit fabricating test results, battery life claims, or
              fake personal trials.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <Sparkles className="h-6 w-6 text-orange-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">Full Content Spectrum</h3>
            <p className="mt-1 text-slate-600">
              From schema markup and FAQ accordions to social threads and comparison matrices in one
              package.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <Award className="h-6 w-6 text-indigo-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">Compliance By Default</h3>
            <p className="mt-1 text-slate-600">
              Mandatory affiliate disclosures and Amazon Associates guidelines baked into every
              exported document.
            </p>
          </div>
        </div>

        <AdSlot placement="article-bottom" />
      </div>
    </div>
  );
};
