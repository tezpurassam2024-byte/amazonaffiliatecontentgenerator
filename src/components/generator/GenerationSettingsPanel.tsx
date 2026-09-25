import React, { useState } from 'react';
import {
  Sliders,
  Users,
  Feather,
  FileCode,
  Gauge,
  Key,
  Plus,
  X,
  Tag,
  HelpCircle,
} from 'lucide-react';
import { ContentGenerationOptions } from '../../types';

interface GenerationSettingsPanelProps {
  options: ContentGenerationOptions;
  onChange: (options: ContentGenerationOptions) => void;
  defaultAssociateTag?: string;
}

export const GenerationSettingsPanel: React.FC<GenerationSettingsPanelProps> = ({
  options,
  onChange,
  defaultAssociateTag = 'affiliate-20',
}) => {
  const [newSecKw, setNewSecKw] = useState('');
  const [newLtKw, setNewLtKw] = useState('');

  const writingStyles: ContentGenerationOptions['writing_style'][] = [
    'Professional',
    'Friendly',
    'Conversational',
    'Technical',
    'Beginner-friendly',
    'Review-style',
    'Buying-guide style',
  ];

  const targetAudiences: ContentGenerationOptions['target_audience'][] = [
    'General consumers',
    'Tech enthusiasts',
    'Professionals',
    'Students',
    'Parents',
    'Gamers',
    'Photographers',
    'Budget shoppers',
  ];

  const wordLengths: ContentGenerationOptions['review_length'][] = ['500', '1000', '1500', '2000'];

  const seoIntensities: ContentGenerationOptions['seo_intensity'][] = [
    'Natural',
    'Standard SEO',
    'Strong SEO',
  ];

  const handleAddSecondaryKw = () => {
    if (!newSecKw.trim()) return;
    onChange({
      ...options,
      keywords: {
        ...options.keywords,
        secondary: [...options.keywords.secondary, newSecKw.trim()],
      },
    });
    setNewSecKw('');
  };

  const handleRemoveSecondaryKw = (index: number) => {
    onChange({
      ...options,
      keywords: {
        ...options.keywords,
        secondary: options.keywords.secondary.filter((_, i) => i !== index),
      },
    });
  };

  const handleAddLongTailKw = () => {
    if (!newLtKw.trim()) return;
    onChange({
      ...options,
      keywords: {
        ...options.keywords,
        long_tail: [...options.keywords.long_tail, newLtKw.trim()],
      },
    });
    setNewLtKw('');
  };

  const handleRemoveLongTailKw = (index: number) => {
    onChange({
      ...options,
      keywords: {
        ...options.keywords,
        long_tail: options.keywords.long_tail.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
          4
        </span>
        <div>
          <h3 className="text-base font-bold text-slate-900">AI Content & Keyword Settings</h3>
          <p className="text-xs text-slate-500">
            Tailor tone, length, target audience, and natural search keywords
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Writing Style */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Feather className="h-3.5 w-3.5 text-orange-600" /> Writing Style
          </label>
          <select
            value={options.writing_style}
            onChange={(e) =>
              onChange({
                ...options,
                writing_style: e.target.value as ContentGenerationOptions['writing_style'],
              })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none"
          >
            {writingStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Target Audience */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Users className="h-3.5 w-3.5 text-orange-600" /> Target Audience
          </label>
          <select
            value={options.target_audience}
            onChange={(e) =>
              onChange({
                ...options,
                target_audience: e.target.value as ContentGenerationOptions['target_audience'],
              })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none"
          >
            {targetAudiences.map((aud) => (
              <option key={aud} value={aud}>
                {aud}
              </option>
            ))}
          </select>
        </div>

        {/* Review Word Length */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <FileCode className="h-3.5 w-3.5 text-orange-600" /> Review Length
          </label>
          <div className="mt-1.5 grid grid-cols-4 gap-1">
            {wordLengths.map((len) => (
              <button
                key={len}
                type="button"
                onClick={() =>
                  onChange({
                    ...options,
                    review_length: len,
                  })
                }
                className={`rounded-lg py-1.5 text-center text-xs font-bold transition-all ${
                  options.review_length === len
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {len}w
              </button>
            ))}
          </div>
        </div>

        {/* SEO Intensity */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Gauge className="h-3.5 w-3.5 text-orange-600" /> SEO Intensity
          </label>
          <select
            value={options.seo_intensity}
            onChange={(e) =>
              onChange({
                ...options,
                seo_intensity: e.target.value as ContentGenerationOptions['seo_intensity'],
              })
            }
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-orange-500 focus:outline-none"
          >
            {seoIntensities.map((intensity) => (
              <option key={intensity} value={intensity}>
                {intensity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Keywords & Affiliate Tag Section */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Primary Keyword */}
          <div>
            <label className="block text-xs font-bold text-slate-800">
              Primary Target Keyword
            </label>
            <input
              type="text"
              value={options.keywords.primary}
              onChange={(e) =>
                onChange({
                  ...options,
                  keywords: { ...options.keywords, primary: e.target.value },
                })
              }
              placeholder="e.g. Sony WH-1000XM5 review"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
            />
            <span className="mt-1 block text-[10px] text-slate-500">
              Included naturally in title, H2 headings, and intro
            </span>
          </div>

          {/* Secondary Keywords */}
          <div>
            <label className="block text-xs font-bold text-slate-800">Secondary Keywords</label>
            <div className="mt-1.5 flex gap-1.5">
              <input
                type="text"
                value={newSecKw}
                onChange={(e) => setNewSecKw(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSecondaryKw();
                  }
                }}
                placeholder="Add keyword..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSecondaryKw}
                className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {options.keywords.secondary.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryKw(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Amazon Associate Tag */}
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Tag className="h-3.5 w-3.5 text-orange-600" /> Amazon Associate Tag
            </label>
            <input
              type="text"
              value={options.affiliate_tag ?? defaultAssociateTag}
              onChange={(e) =>
                onChange({
                  ...options,
                  affiliate_tag: e.target.value,
                })
              }
              placeholder="e.g. yourtag-20"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
            />
            <span className="mt-1 block text-[10px] text-slate-500">
              Appended to generated Amazon buy buttons
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
