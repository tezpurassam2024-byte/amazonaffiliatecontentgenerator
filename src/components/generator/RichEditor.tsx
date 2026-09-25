import React, { useState } from 'react';
import {
  Wand2,
  Minimize2,
  Maximize2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  productName: string;
  writingStyle: string;
  keywords?: string[];
  onRefined?: (newText: string) => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  productName,
  writingStyle,
  keywords,
  onRefined,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charsCount = value.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefine = async (
    action: 'improve' | 'shorten' | 'expand' | 'more_human' | 'regenerate' | 'seo_boost'
  ) => {
    if (!value.trim() || isProcessing) return;
    setIsProcessing(true);
    setActiveAction(action);

    try {
      const res = await fetch('/.netlify/functions/refine-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionText: value,
          action,
          productName,
          writingStyle,
          keywords,
        }),
      });

      const data = await res.json();
      if (data.success && data.refinedText) {
        onChange(data.refinedText);
        if (onRefined) onRefined(data.refinedText);
      } else {
        alert(data.error || 'Failed to refine content.');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with AI refiner.');
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Editor Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('improve')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Enhance clarity, persuasiveness, and flow"
          >
            <Sparkles className="h-3 w-3 text-orange-600" />
            {isProcessing && activeAction === 'improve' ? 'Improving...' : 'Improve'}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('more_human')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Remove artificial AI style patterns and sound natural"
          >
            <Wand2 className="h-3 w-3 text-indigo-600" />
            {isProcessing && activeAction === 'more_human' ? 'Polishing...' : 'Make More Human'}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('shorten')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Make concise without losing key points"
          >
            <Minimize2 className="h-3 w-3 text-blue-600" />
            {isProcessing && activeAction === 'shorten' ? 'Shortening...' : 'Shorten'}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('expand')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Expand with more detail and context"
          >
            <Maximize2 className="h-3 w-3 text-emerald-600" />
            {isProcessing && activeAction === 'expand' ? 'Expanding...' : 'Expand'}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('seo_boost')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Naturally optimize keyword placement"
          >
            <TrendingUp className="h-3 w-3 text-purple-600" />
            {isProcessing && activeAction === 'seo_boost' ? 'Optimizing...' : 'SEO Boost'}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleRefine('regenerate')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 disabled:opacity-50"
            title="Regenerate alternative phrasing"
          >
            <RotateCcw className="h-3 w-3 text-amber-600" />
            {isProcessing && activeAction === 'regenerate' ? 'Generating...' : 'Regenerate'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-500">
            {wordsCount} words ({charsCount} chars)
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-slate-500" /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative p-3">
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-b-xl bg-white/70 backdrop-blur-xs">
            <div className="flex h-10 w-10 animate-spin items-center justify-center rounded-full border-3 border-orange-600 border-t-transparent" />
            <p className="mt-2 text-xs font-semibold text-slate-700">Refining with Gemini...</p>
          </div>
        )}
        <textarea
          rows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y font-mono text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none"
          placeholder="Generated content will appear here..."
        />
      </div>
    </div>
  );
};
