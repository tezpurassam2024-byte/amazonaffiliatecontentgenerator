import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileText,
  Code,
  Globe,
  X,
  FileCode2,
} from 'lucide-react';
import { AmazonProduct, GeneratedArticleContent } from '../../types';
import {
  generateFullMarkdown,
  generateCleanHtml,
  generatePlainText,
  downloadFile,
} from '../../lib/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: AmazonProduct;
  content: GeneratedArticleContent;
  affiliateTag?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  product,
  content,
  affiliateTag,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const slug = (
    content.seo_titles?.selected ||
    product.model ||
    product.product_name
  )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);

  const handleCopy = (text: string, formatName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatName);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullMarkdown(product, content, affiliateTag);
    downloadFile(`${slug}-review.md`, md, 'text/markdown;charset=utf-8');
  };

  const handleDownloadHtml = () => {
    const html = generateCleanHtml(product, content, affiliateTag);
    downloadFile(`${slug}-review.html`, html, 'text/html;charset=utf-8');
  };

  const handleDownloadTxt = () => {
    const txt = generatePlainText(product, content, affiliateTag);
    downloadFile(`${slug}-review.txt`, txt, 'text/plain;charset=utf-8');
  };

  const markdownText = generateFullMarkdown(product, content, affiliateTag);
  const htmlText = generateCleanHtml(product, content, affiliateTag);
  const plainText = generatePlainText(product, content, affiliateTag);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Export Finished Content Package</h3>
            <p className="text-xs text-slate-500">
              Download or copy clean formatting ready for WordPress, Blogger, or CMS
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {copiedFormat && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Copied {copiedFormat} to clipboard!</span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Markdown Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Markdown (.md)</h4>
                <p className="text-[11px] text-slate-500">
                  Ideal for Ghost, Hugo, Astro, Obsidian, or Notion
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(markdownText, 'Markdown')}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                Copy MD
              </button>
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="flex items-center justify-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange-700"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>

          {/* WordPress & Clean HTML Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">WordPress / HTML (.html)</h4>
                <p className="text-[11px] text-slate-500">
                  Clean semantic HTML with Gutenberg block styling
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(htmlText, 'WordPress HTML')}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                Copy for WP
              </button>
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Plain Text Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-slate-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Plain Text (.txt)</h4>
                <p className="text-[11px] text-slate-500">
                  Stripped formatting for email newsletters or notes
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(plainText, 'Plain Text')}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                Copy Text
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>

          {/* Schema JSON-LD Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Schema Markup (JSON-LD)</h4>
                <p className="text-[11px] text-slate-500">
                  Product & Review structured data for Google snippets
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    content.schema_markup?.product_schema || '{}',
                    'Schema JSON-LD'
                  )
                }
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                Copy JSON-LD
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
