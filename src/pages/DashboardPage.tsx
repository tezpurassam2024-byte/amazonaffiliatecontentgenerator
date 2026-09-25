import React, { useState } from 'react';
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  ExternalLink,
  Edit3,
  Layers,
  Table,
  Zap,
  Bookmark,
  BarChart3,
  Check,
  Award,
} from 'lucide-react';
import { UserProfile, Article, AmazonProduct } from '../types';
import { localDb } from '../lib/convex';
import { SUPPORTED_MARKETPLACES, SAMPLE_PRODUCTS } from '../lib/amazon';
import { AdSlot } from '../components/common/AdSlot';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (route: string) => void;
  onSelectArticle: (article: Article) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  onSelectArticle,
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'products' | 'comparisons' | 'templates' | 'usage'>('overview');

  const articles = localDb.getArticles();
  const publishedCount = articles.filter((a) => a.status === 'Published').length;
  const draftCount = articles.filter((a) => a.status === 'Draft' || a.status === 'Generated').length;

  // Extracted unique products
  const productsCatalog: AmazonProduct[] = [
    ...SAMPLE_PRODUCTS,
    ...articles.map((a) => a.product),
  ].filter((p, index, self) => index === self.findIndex((t) => t.asin === p.asin));

  const templates = [
    {
      id: 'tech_deep_dive',
      title: 'Flagship Tech Deep Dive',
      category: 'Electronics & Gadgets',
      desc: 'Technical, in-depth 1,500-word review focusing on hardware benchmarks, display quality, and thermals.',
      style: 'Technical',
      audience: 'Tech enthusiasts',
      length: '1500',
    },
    {
      id: 'budget_buyer',
      title: 'Budget Value Evaluator',
      category: 'Affordable Alternatives',
      desc: 'Conversational 1,000-word breakdown focusing on price-to-performance ratio and real-world durability.',
      style: 'Conversational',
      audience: 'Budget shoppers',
      length: '1000',
    },
    {
      id: 'beginners_guide',
      title: 'Beginner-Friendly Buying Guide',
      category: 'General Consumers',
      desc: 'Approachable, jargon-free 1,000-word review emphasizing ease of setup, ergonomics, and simple controls.',
      style: 'Beginner-friendly',
      audience: 'General consumers',
      length: '1000',
    },
    {
      id: 'speed_comparison',
      title: 'Quick 4-Way Comparison Sheet',
      category: 'Multi-Product',
      desc: 'Optimized comparison matrix contrasting top category alternatives with a decisive winner verdict.',
      style: 'Buying-guide style',
      audience: 'Professionals',
      length: '1000',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Publisher Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Welcome back, {user.name}! Track your affiliate content pipeline, products, and usage.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('my-articles')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span>My Articles ({articles.length})</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('generator')}
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Article</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar (Section 49) */}
          <div className="mt-6 flex overflow-x-auto gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => setSubTab('overview')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'overview'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSubTab('products')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'products'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Products ({productsCatalog.length})
            </button>
            <button
              onClick={() => setSubTab('comparisons')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'comparisons'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Comparisons
            </button>
            <button
              onClick={() => setSubTab('templates')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'templates'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Templates ({templates.length})
            </button>
            <button
              onClick={() => setSubTab('usage')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'usage'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Usage Quota
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* SUBTAB: OVERVIEW */}
        {subTab === 'overview' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Articles</span>
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">{articles.length}</p>
                <span className="mt-1 block text-[11px] text-slate-400">In database</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Published Content</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">{publishedCount}</p>
                <span className="mt-1 block text-[11px] text-emerald-600">Active on web</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Drafts / In Progress</span>
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">{draftCount}</p>
                <span className="mt-1 block text-[11px] text-amber-600">Awaiting publishing</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Monthly Usage</span>
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {user.generations_used} / {user.generations_limit}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-orange-600"
                    style={{
                      width: `${Math.min(
                        100,
                        (user.generations_used / user.generations_limit) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Affiliate Tag Reminder Banner */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50/60 to-white p-5 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Active Amazon Associate Tag</h4>
                  <p className="text-xs text-slate-600">
                    Current tag:{' '}
                    <span className="font-mono font-bold text-orange-700">
                      {user.amazon_associate_tag || 'Not configured'}
                    </span>{' '}
                    • Marketplace: {SUPPORTED_MARKETPLACES[user.default_marketplace]?.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Manage Tag & Settings
              </button>
            </div>

            {/* Recent Articles */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Generated Articles</h3>
                  <p className="text-xs text-slate-500">Your latest Amazon affiliate articles</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('my-articles')}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {articles.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />
                  <h4 className="mt-3 text-sm font-bold text-slate-900">No articles created yet</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Generate your first complete affiliate review in under 2 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('generator')}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Start First Article
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500">
                        <th className="py-3 px-6 font-semibold">Product & Title</th>
                        <th className="py-3 px-6 font-semibold">Marketplace</th>
                        <th className="py-3 px-6 font-semibold">Status</th>
                        <th className="py-3 px-6 font-semibold">Updated</th>
                        <th className="py-3 px-6 text-right font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {articles.slice(0, 5).map((art) => {
                        const mp = SUPPORTED_MARKETPLACES[art.product.marketplace];
                        return (
                          <tr key={art.id} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-6">
                              <p className="font-bold text-slate-900 line-clamp-1">{art.title}</p>
                              <p className="text-[11px] text-slate-500">{art.product.product_name}</p>
                            </td>
                            <td className="py-3.5 px-6">
                              <span className="inline-flex items-center gap-1 text-slate-700">
                                <span>{mp?.flag}</span>
                                <span>{mp?.domain}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-6">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  art.status === 'Published'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : art.status === 'Edited'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {art.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-slate-500">
                              {new Date(art.updated_at).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => onSelectArticle(art)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                <Edit3 className="h-3 w-3" /> Open
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* SUBTAB: PRODUCTS */}
        {subTab === 'products' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Products Catalog ({productsCatalog.length})</h3>
                <p className="text-xs text-slate-500">All analyzed Amazon products and baseline specifications</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('generator')}
                className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700"
              >
                <PlusCircle className="h-3.5 w-3.5" /> New Product
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {productsCatalog.map((prod) => (
                <div key={prod.id} className="rounded-xl border border-slate-200 p-4 hover:border-orange-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-600">{prod.brand}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                        {prod.asin}
                      </span>
                    </div>
                    <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-2">{prod.product_name}</h4>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Price: {prod.price || 'N/A'} • {prod.rating}★ ({prod.review_count?.toLocaleString()} reviews)
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 capitalize">{prod.category}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('generator');
                      }}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      Generate Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: COMPARISONS */}
        {subTab === 'comparisons' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Competitor Comparison Tables</h3>
              <p className="text-xs text-slate-500">Side-by-side matrices comparing main products against top category competitors</p>
            </div>

            <div className="space-y-4">
              {articles
                .filter((a) => a.content.comparison)
                .map((art) => (
                  <div key={art.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{art.title}</span>
                      <span className="text-xs text-orange-600 font-semibold">
                        {(art.content.comparison?.comparison_products || []).length} Competitors
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{art.content.comparison?.verdict}</p>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectArticle(art)}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View Full Comparison
                      </button>
                    </div>
                  </div>
                ))}
              {articles.filter((a) => a.content.comparison).length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  No comparisons generated yet. Enable the Comparison Table module in your next article!
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB: TEMPLATES */}
        {subTab === 'templates' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Editorial Tone & Style Templates</h3>
              <p className="text-xs text-slate-500">Pre-configured prompts tailored for specific buyer personas and affiliate niches</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="rounded-xl border border-slate-200 p-5 hover:border-orange-300 transition-all flex flex-col justify-between">
                  <div>
                    <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                      {tmpl.category}
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-slate-900">{tmpl.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{tmpl.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="rounded bg-slate-100 px-2 py-0.5">Style: {tmpl.style}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5">Target: {tmpl.audience}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5">{tmpl.length} words</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('generator')}
                    className="mt-4 w-full rounded-lg bg-orange-50 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 transition-all"
                  >
                    Use This Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: USAGE */}
        {subTab === 'usage' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Monthly Usage & Quota Telemetry</h3>
              <p className="text-xs text-slate-500">Track article generations and plan limits</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-semibold text-slate-500">Plan Tier</span>
                <p className="mt-1 text-xl font-bold text-slate-900 capitalize">{user.plan}</p>
                <span className="text-[11px] text-slate-400">Monthly renewal</span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-semibold text-slate-500">Generations Used</span>
                <p className="mt-1 text-xl font-bold text-orange-600">{user.generations_used}</p>
                <span className="text-[11px] text-slate-400">This billing cycle</span>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-semibold text-slate-500">Generations Limit</span>
                <p className="mt-1 text-xl font-bold text-slate-900">{user.generations_limit}</p>
                <span className="text-[11px] text-slate-400">Total monthly quota</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Quota Consumption</span>
                <span>{Math.round((user.generations_used / user.generations_limit) * 100)}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (user.generations_used / user.generations_limit) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-700 shadow-sm"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
