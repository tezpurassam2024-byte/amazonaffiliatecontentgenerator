import React from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

interface PricingPageProps {
  onSelectPlan: (plan: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Simple Transparent Pricing
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Choose the Perfect Plan for Your Content Volume
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Start free, upgrade as your affiliate websites and blogs expand. Cancel anytime.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 space-y-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Free Tier */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Free</span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Starter</h3>
              <p className="mt-1 text-xs text-slate-500">Perfect for trying out the platform</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500">/month forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>5 full article packages / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>10 Amazon marketplaces supported</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>All 12 editorial modules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Markdown, HTML, & TXT exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Manual fallback input</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onSelectPlan('free')}
              className="mt-8 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="relative flex flex-col justify-between rounded-3xl border-2 border-orange-500 bg-white p-6 shadow-xl sm:p-8">
            <span className="absolute -top-3.5 right-6 rounded-full bg-orange-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Professional
              </span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Pro Publisher</h3>
              <p className="mt-1 text-xs text-slate-500">
                For active bloggers & affiliate review sites
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$29</span>
                <span className="text-xs text-slate-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">50 article packages / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>1,500 & 2,000-word comprehensive reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Interactive AI Content Refiner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Up to 4 competitor comparison tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Priority Gemini generation speed</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onSelectPlan('pro')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs font-bold text-white shadow-md shadow-orange-600/30 hover:bg-orange-700"
            >
              <Zap className="h-4 w-4" /> Start Pro Plan
            </button>
          </div>

          {/* Business Tier */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scale</span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Agency / Business</h3>
              <p className="mt-1 text-xs text-slate-500">For multi-site portfolios & agencies</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$79</span>
                <span className="text-xs text-slate-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">250 article packages / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Team collaboration & multi-users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Full version history & rollback</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Dedicated Netlify deployment support</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onSelectPlan('business')}
              className="mt-8 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Contact for Business
            </button>
          </div>
        </div>

        {/* AdSlot */}
        <AdSlot placement="in-content" />
      </div>
    </div>
  );
};
