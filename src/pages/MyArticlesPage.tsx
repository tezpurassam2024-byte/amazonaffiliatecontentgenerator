import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  Download,
  Calendar,
} from 'lucide-react';
import { Article, ArticleStatus } from '../types';
import { localDb } from '../lib/convex';
import { SUPPORTED_MARKETPLACES } from '../lib/amazon';
import { ExportModal } from '../components/generator/ExportModal';

interface MyArticlesPageProps {
  onNavigate: (route: string) => void;
  onOpenArticle: (article: Article) => void;
}

export const MyArticlesPage: React.FC<MyArticlesPageProps> = ({
  onNavigate,
  onOpenArticle,
}) => {
  const [articles, setArticles] = useState<Article[]>(localDb.getArticles());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [exportTarget, setExportTarget] = useState<Article | null>(null);

  const filtered = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.product.asin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || art.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      localDb.deleteArticle(id);
      setArticles(localDb.getArticles());
    }
  };

  const handleDuplicate = (art: Article) => {
    const dup: Article = {
      ...art,
      id: `art_${Date.now()}`,
      title: `${art.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'Draft',
    };
    localDb.saveArticle(dup);
    setArticles(localDb.getArticles());
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Articles ({articles.length})
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage, edit, export, and monitor your Amazon affiliate content library
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('generator')}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Article</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Status Filters */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, product, or ASIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Draft', 'Generated', 'Edited', 'Published'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 text-sm font-bold text-slate-900">No articles match your filter</h3>
              <p className="mt-1 text-xs text-slate-500">
                Try searching with different terms or generate a new article.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500">
                    <th className="py-3 px-6 font-semibold">Product & Title</th>
                    <th className="py-3 px-6 font-semibold">Marketplace</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold">Created Date</th>
                    <th className="py-3 px-6 font-semibold">Last Modified</th>
                    <th className="py-3 px-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((art) => {
                    const mp = SUPPORTED_MARKETPLACES[art.product.marketplace];
                    return (
                      <tr key={art.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-6">
                          <p className="font-bold text-slate-900 line-clamp-1">{art.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {art.product.product_name} • ASIN: {art.product.asin}
                          </p>
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
                          {new Date(art.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">
                          {new Date(art.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenArticle(art)}
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
                              title="Open & Edit"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setExportTarget(art)}
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
                              title="Export"
                            >
                              <Download className="h-3.5 w-3.5 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDuplicate(art)}
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
                              title="Duplicate"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(art.id, art.title)}
                              className="rounded-lg border border-slate-200 bg-white p-1.5 text-rose-500 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {exportTarget && (
        <ExportModal
          isOpen={Boolean(exportTarget)}
          onClose={() => setExportTarget(null)}
          product={exportTarget.product}
          content={exportTarget.content}
          affiliateTag={exportTarget.options.affiliate_tag}
        />
      )}
    </div>
  );
};
