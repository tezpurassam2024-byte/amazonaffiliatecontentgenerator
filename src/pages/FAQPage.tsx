import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How does the Amazon Affiliate Content Generator work?',
    a: 'You enter any Amazon product URL (from 10 supported marketplaces) or provide specifications manually. Our engine extracts the ASIN and product metadata, confirms the attributes with you, and uses server-side Gemini 3.8 to generate 12 distinct content sections including SEO titles, in-depth reviews, pros & cons, specifications, comparison tables, FAQs, JSON-LD schema, and social posts.',
  },
  {
    q: 'Does this comply with the Amazon Associates Operating Agreement?',
    a: 'Yes. AffiGenius is built strictly around compliance. It automatically generates FTC-compliant affiliate disclosure statements, instructs creators never to fabricate personal trials, avoids hardcoding unauthorized live prices, and appends your Amazon Store tag to buy links.',
  },
  {
    q: 'Which Amazon marketplaces are supported?',
    a: 'Initially 10 Amazon marketplaces are supported: US (.com), India (.in), UK (.co.uk), Canada (.ca), Australia (.com.au), Germany (.de), France (.fr), Italy (.it), Spain (.es), and Japan (.co.jp). Additional regional stores can be configured in the administrator panel.',
  },
  {
    q: 'Can I use manual product details if the Amazon URL fails to fetch?',
    a: 'Absolutely. A comprehensive manual fallback form is built right into Step 1. You can enter the product title, brand, model, price, rating, bullet points, and key-value specs. The AI will strictly ground its review in your supplied facts.',
  },
  {
    q: 'How do I export content to WordPress or my CMS?',
    a: 'Our Export modal allows you to copy or download Markdown (.md), clean semantic HTML (.html), plain text (.txt), and WordPress Gutenberg-ready markup with a single click. JSON-LD schema markup can also be copied directly into your header or SEO plugin.',
  },
  {
    q: 'Where are my articles stored?',
    a: 'Articles are saved in your reactive Convex backend database. If you have not configured a Convex deployment URL yet (VITE_CONVEX_URL), the application gracefully saves your articles, settings, and logs into browser local storage so you can test all features immediately without setup friction.',
  },
  {
    q: 'Can I deploy this to Netlify?',
    a: 'Yes! The entire application architecture is built specifically for Netlify with netlify.toml and Netlify Functions (netlify/functions/) to keep your Gemini API keys securely protected on the server.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Got Questions?
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Everything you need to know about content generation, Amazon compliance, and deployment.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8 space-y-4">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:bg-slate-50/50"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-orange-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-8">
          <AdSlot placement="in-content" />
        </div>
      </div>
    </div>
  );
};
