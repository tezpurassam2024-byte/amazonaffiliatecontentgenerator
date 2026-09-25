import React, { useState } from 'react';
import {
  Settings,
  Tag,
  Database,
  Key,
  Shield,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, MarketplaceId } from '../types';
import { localDb, isConvexConfigured, CONVEX_CLOUD_URL } from '../lib/convex';
import { SUPPORTED_MARKETPLACES } from '../lib/amazon';
import { CONVEX_SCHEMA_CODE } from '../lib/convex-schema-code';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const [associateTag, setAssociateTag] = useState(user.amazon_associate_tag || '');
  const [defaultMarketplace, setDefaultMarketplace] = useState<MarketplaceId>(
    user.default_marketplace || 'com'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      amazon_associate_tag: associateTag.trim(),
      default_marketplace: defaultMarketplace,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(CONVEX_SCHEMA_CODE);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Settings & Integrations
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure your Amazon Associate credentials, Convex backend database, and Netlify deployment
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Amazon Associates Settings */}
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Tag className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Amazon Associates Settings</h3>
              <p className="text-xs text-slate-500">
                Your tracking tag will be automatically appended to all generated affiliate buy buttons
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800">
                Amazon Associate Tracking Tag (Store ID)
              </label>
              <input
                type="text"
                value={associateTag}
                onChange={(e) => setAssociateTag(e.target.value)}
                placeholder="e.g. yourstorename-20"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium focus:border-orange-500 focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-slate-500">
                Found in your Amazon Associates dashboard (e.g., ends in -20, -21, or -31)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Default Amazon Marketplace
              </label>
              <select
                value={defaultMarketplace}
                onChange={(e) => setDefaultMarketplace(e.target.value as MarketplaceId)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-orange-500 focus:outline-none"
              >
                {Object.values(SUPPORTED_MARKETPLACES).map((mp) => (
                  <option key={mp.id} value={mp.id}>
                    {mp.flag} {mp.name} ({mp.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700"
            >
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </form>

        {/* Database & Netlify Architecture */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Convex Reactive Backend & Database
                </h3>
                <p className="text-xs text-slate-500">
                  TypeScript-first reactive backend with automatic indexing, queries, and mutations
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isConvexConfigured
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isConvexConfigured ? '● Convex Connected' : '○ Offline / Local Fallback Active'}
            </span>
          </div>

          {/* Active Deployment Details */}
          <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-bold text-slate-800">Convex Cloud Deployment:</span>
                <p className="mt-0.5 font-mono text-[11px] text-indigo-700 font-semibold break-all">
                  {CONVEX_CLOUD_URL}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Schema & Functions Synced
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Convex Cloud Information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
              <li>
                Deployment URL:{' '}
                <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-700">
                  {CONVEX_CLOUD_URL}
                </code>
              </li>
              <li>
                All tables (<code className="font-mono">appointments</code>, <code className="font-mono">articles</code>, <code className="font-mono">users</code>, <code className="font-mono">products</code>, <code className="font-mono">comparisons</code>, <code className="font-mono">logs</code>) and index structures are deployed.
              </li>
              <li>
                Environment variable <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">VITE_CONVEX_URL</code> is configured.
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Convex Schema (<code className="font-mono text-indigo-600">convex/schema.ts</code>)
            </span>
            <button
              type="button"
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copiedSchema ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied Convex Schema!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Convex Schema
                </>
              )}
            </button>
          </div>

          <pre className="mt-2 max-h-60 overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] leading-relaxed text-indigo-300">
            <code>{CONVEX_SCHEMA_CODE}</code>
          </pre>
        </div>

        {/* Netlify Deployment Checklist (Section 55 Setup Required) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Setup Required & Netlify Deployment Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Simple checklist for deploying your production app to Netlify with Convex
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900">1. Netlify Repository Connection</p>
                <p className="text-slate-500">
                  Connect your GitHub repository to Netlify. Netlify will automatically detect{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">
                    npm run build
                  </code>{' '}
                  and the{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">dist</code> directory
                  via <code className="font-mono">netlify.toml</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900">
                  2. Netlify Functions & Serverless API Routes
                </p>
                <p className="text-slate-500">
                  All AI generation endpoints are located in{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">
                    netlify/functions/
                  </code>{' '}
                  to keep secret keys strictly server-side.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900">
                  3. Configure Environment Variables in Netlify
                </p>
                <p className="text-slate-500">
                  Under <em>Site configuration &gt; Environment variables</em>, add:
                </p>
                <ul className="mt-1 list-disc pl-5 font-mono text-[11px] text-slate-600">
                  <li>
                    <strong>GEMINI_API_KEY</strong> (server-side only)
                  </li>
                  <li>
                    <strong>VITE_CONVEX_URL</strong> (client-side Convex deployment URL)
                  </li>
                  <li>
                    <strong>AMAZON_ASSOCIATE_TAG</strong> (your tracking ID)
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900">4. Amazon Associates Compliance</p>
                <p className="text-slate-500">
                  Ensure all review pages feature the mandatory affiliate disclosure and that you
                  never fabricate personal trials or laboratory benchmark claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
