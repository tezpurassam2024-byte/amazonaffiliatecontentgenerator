import React from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  Table,
  HelpCircle,
  Share2,
  Code2,
  ShieldCheck,
  Type,
  Image as ImageIcon,
  CheckCheck,
} from 'lucide-react';
import { ContentGenerationOptions } from '../../types';

interface ModulesSelectorProps {
  options: ContentGenerationOptions;
  onChange: (options: ContentGenerationOptions) => void;
}

export const ModulesSelector: React.FC<ModulesSelectorProps> = ({ options, onChange }) => {
  const moduleConfig = [
    {
      key: 'seo_title' as const,
      label: 'SEO Title (5 Options)',
      desc: '50-65 chars high-intent click-optimized titles',
      icon: Type,
    },
    {
      key: 'review' as const,
      label: 'In-Depth Product Review',
      desc: '500 - 2,000 words structured into clear editorial sections',
      icon: FileText,
    },
    {
      key: 'pros_cons' as const,
      label: 'Pros & Cons Table',
      desc: 'Factual advantages and real limitations based on data',
      icon: Table,
    },
    {
      key: 'specifications' as const,
      label: 'Product Specifications Table',
      desc: 'Clean structured specs table for quick reference',
      icon: Table,
    },
    {
      key: 'comparison' as const,
      label: 'Product Comparison Matrix',
      desc: 'Compare with category competitors across vital attributes',
      icon: Table,
    },
    {
      key: 'faq' as const,
      label: 'FAQ Section (8-10 Items)',
      desc: 'Buyer objections answered strictly from product facts',
      icon: HelpCircle,
    },
    {
      key: 'meta_title' as const,
      label: 'Meta Titles (3 Options)',
      desc: '50-60 chars search engine snippet titles',
      icon: Type,
    },
    {
      key: 'meta_description' as const,
      label: 'Meta Descriptions (3 Options)',
      desc: '140-160 chars high-CTR search descriptions',
      icon: FileText,
    },
    {
      key: 'image_caption' as const,
      label: 'Image SEO & Alt Text',
      desc: 'Accessible alt texts and contextual image captions',
      icon: ImageIcon,
    },
    {
      key: 'schema_markup' as const,
      label: 'JSON-LD Schema Markup',
      desc: 'Valid Product, Review, and FAQPage structured data',
      icon: Code2,
    },
    {
      key: 'affiliate_disclosure' as const,
      label: 'Amazon Affiliate Disclosure',
      desc: 'FTC and Amazon Associates Operating Agreement compliant',
      icon: ShieldCheck,
    },
    {
      key: 'social_media' as const,
      label: 'Social Media Posts Pack',
      desc: 'Ready-to-post copy for X, Facebook, LinkedIn, IG, Pinterest',
      icon: Share2,
    },
  ];

  const allSelected = Object.values(options.modules).every(Boolean);

  const toggleAll = () => {
    const nextState = !allSelected;
    const newModules = { ...options.modules };
    Object.keys(newModules).forEach((k) => {
      (newModules as any)[k] = nextState;
    });
    onChange({ ...options, modules: newModules });
  };

  const toggleModule = (key: keyof typeof options.modules) => {
    onChange({
      ...options,
      modules: {
        ...options.modules,
        [key]: !options.modules[key],
      },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
            3
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Select Content Modules</h3>
            <p className="text-xs text-slate-500">
              Choose which sections the AI will generate in this package
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 active:scale-95"
        >
          <CheckCheck className="h-4 w-4 text-orange-600" />
          {allSelected ? 'Deselect All' : 'Select All / Generate Everything'}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {moduleConfig.map((item) => {
          const isChecked = options.modules[item.key];
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => toggleModule(item.key)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                isChecked
                  ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/20'
                  : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5 text-orange-600">
                {isChecked ? (
                  <CheckSquare className="h-5 w-5 fill-orange-500 text-white" />
                ) : (
                  <Square className="h-5 w-5 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900">{item.label}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
