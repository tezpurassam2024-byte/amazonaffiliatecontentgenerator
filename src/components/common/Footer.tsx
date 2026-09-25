import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* Optional AdSense footer slot */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <AdSlot placement="footer" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div
              onClick={() => onNavigate('landing')}
              className="flex cursor-pointer items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                Affi<span className="text-orange-600">Genius</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
              The AI-powered affiliate content engine for publishers, bloggers, and review sites.
              Turn any Amazon URL into factual, high-converting reviews, specs tables, schema
              markup, and social posts.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Netlify & Gemini Ready
              </span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Product</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('generator')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Content Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Features & Modules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Affiliate Strategy Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Support & Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('appointment')}
                  className="text-orange-600 font-semibold hover:text-orange-700 inline-flex items-center gap-1"
                >
                  📅 Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('settings')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  API & Setup Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal & Trust</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('affiliate-disclosure')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="text-slate-600 hover:text-orange-600"
                >
                  Earnings Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Associates Disclaimer */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <p className="text-[11px] leading-relaxed text-slate-400">
            <strong>Amazon Associates & Legal Disclaimer:</strong> CERTAIN CONTENT THAT APPEARS ON
            THIS APPLICATION COMES FROM AMAZON SERVICES LLC OR ITS AFFILIATES. THIS CONTENT IS
            PROVIDED &apos;AS IS&apos; AND IS SUBJECT TO CHANGE OR REMOVAL AT ANY TIME. Amazon and the
            Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. AffiGenius is an
            independent editorial assistance application for publishers. Publishers are solely
            responsible for adhering to the Amazon Associates Operating Agreement, FTC endorsement
            guidelines, and local advertising regulations.
          </p>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AffiGenius. Built for high performance on Netlify.</p>
          <p className="flex items-center gap-1">
            Engineered for publishers with clean SEO practices
          </p>
        </div>
      </div>
    </footer>
  );
};
