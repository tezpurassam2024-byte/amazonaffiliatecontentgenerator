import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, Scale } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'affiliate-disclosure' | 'disclaimer';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'affiliate-disclosure' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="bg-white pb-20">
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Legal & Trust Center
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Policies, Disclosures & Terms
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Transparent compliance documentation for visitors, publishers, and search engines.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8 space-y-8">
        {/* Tab switchers */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('affiliate-disclosure')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'affiliate-disclosure'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Affiliate Disclosure
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'disclaimer'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Earnings Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'privacy'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'terms'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Content Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10 space-y-6 text-xs leading-relaxed text-slate-700">
          {activeTab === 'affiliate-disclosure' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Amazon Affiliate Disclosure</h2>
              <p>
                <strong>Last Updated: September 2026</strong>
              </p>
              <p>
                AffiGenius provides this statement in accordance with the Federal Trade Commission
                (FTC) Guides Concerning the Use of Endorsements and Testimonials in Advertising, and
                the Amazon Associates Operating Agreement.
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 font-medium">
                &quot;CERTAIN CONTENT THAT APPEARS ON THIS SITE COMES FROM AMAZON SERVICES LLC OR ITS
                AFFILIATES. THIS CONTENT IS PROVIDED &apos;AS IS&apos; AND IS SUBJECT TO CHANGE OR
                REMOVAL AT ANY TIME. As an Amazon Associate, publishers earn from qualifying
                purchases.&quot;
              </div>
              <h3 className="text-sm font-bold text-slate-900">What This Means for Readers</h3>
              <p>
                When a reader clicks on an affiliate link and makes a purchase on Amazon, the
                originating publisher may receive a small referral commission at no additional cost
                to the buyer. Prices and availability are accurate at the time of publication and
                are subject to change.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Earnings & Editorial Disclaimer</h2>
              <p>
                <strong>Last Updated: September 2026</strong>
              </p>
              <p>
                AffiGenius provides software tools to assist in drafting editorial reviews and
                content packages. We do not guarantee search engine rankings, website traffic,
                AdSense approvals, or affiliate commission earnings. Success depends on individual
                editorial judgment, audience building, domain authority, and adherence to platform
                policies.
              </p>
              <p>
                Content generated with artificial intelligence should always be reviewed and edited
                by human publishers prior to publication.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Privacy Policy</h2>
              <p>
                <strong>Last Updated: September 2026</strong>
              </p>
              <p>
                Your privacy is paramount. AffiGenius collects only the minimum personal data
                required to provide our services (e.g. account email and saved article content). We
                never sell personal data to third parties.
              </p>
              <h3 className="text-sm font-bold text-slate-900">Cookies & Analytics</h3>
              <p>
                We may use essential session cookies for authentication. Third-party providers such
                as Google AdSense or Google Analytics may use cookies to serve relevant
                advertisements or measure web traffic in compliance with privacy regulations.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Terms of Service</h2>
              <p>
                <strong>Last Updated: September 2026</strong>
              </p>
              <p>
                By accessing AffiGenius, you agree to comply with these terms, applicable laws, and
                the policies of the affiliate networks you promote. You agree not to use this service
                to generate misleading claims, unverified medical or financial advice, or spam.
              </p>
            </div>
          )}
        </div>

        <AdSlot placement="footer" />
      </div>
    </div>
  );
};
