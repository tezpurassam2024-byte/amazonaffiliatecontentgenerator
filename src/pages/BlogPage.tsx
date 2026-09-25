import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { AdSlot } from '../components/common/AdSlot';

interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  content: string[];
}

const POSTS: BlogPost[] = [
  {
    slug: 'high-converting-amazon-product-reviews',
    title: 'How to Write High-Converting Amazon Product Reviews in 2026',
    category: 'Product Reviews',
    excerpt:
      'Discover how to structure affiliate articles for maximum search visibility, user engagement, and click-through rates without violating FTC guidelines.',
    date: 'September 18, 2026',
    readTime: '6 min read',
    author: 'Editorial Team',
    content: [
      'Writing effective affiliate reviews in 2026 requires balancing reader intent with rigorous algorithmic quality checks from search engines. Gone are the days when a surface-level summary of Amazon product bullet points could rank on Google or convert high-ticket shoppers.',
      '### 1. Factual Grounding Over Fabricated Trials',
      'The biggest pitfall for affiliate content creators is pretending to have physically handled every product in a 20-item roundup. Google search algorithms now actively evaluate editorial transparency. State clearly where your data comes from: "Based on manufacturer technical sheets and user feedback trends..." Readers appreciate honesty, and trust drives purchases.',
      '### 2. The Power of Structured Pros and Cons',
      'Visual scan-ability is essential. Over 70% of readers on product review pages are mobile users who skim directly to the Pros & Cons table. Make sure each pro is tied to a concrete benefit, and each con represents a genuine trade-off (e.g. "Lacks wireless charging" rather than vague filler like "Pricey").',
      '### 3. Clear, Compliant CTAs',
      'Position your Amazon affiliate link after meaningful evaluation paragraphs. Ensure buttons clearly indicate where the link leads ("Check Current Price on Amazon") with rel="sponsored nofollow" tags.',
    ],
  },
  {
    slug: 'amazon-associates-compliance-guide',
    title: 'Amazon Associates Operating Agreement: Essential Compliance Guide',
    category: 'Compliance',
    excerpt:
      'Avoid sudden account closures. Learn the non-negotiable rules for affiliate disclosures, price displays, star ratings, and offline link usage.',
    date: 'September 12, 2026',
    readTime: '8 min read',
    author: 'Compliance Legal Desk',
    content: [
      'The Amazon Associates Operating Agreement is one of the strictest affiliate policies on the web. Violations frequently lead to account suspensions and forfeited commissions. Here is what every publisher must know:',
      '### 1. The Mandatory Associate Disclosure',
      'You must prominently state: "As an Amazon Associate I earn from qualifying purchases." This cannot be buried in a footer or obscure disclaimer page. It must be visible before the first affiliate link.',
      '### 2. Live Pricing Rules',
      'Amazon strictly prohibits hardcoding static prices unless accompanied by a timestamp and statement that prices and availability are subject to change. If you do not use the Amazon Product Advertising API to pull real-time pricing, label your call to action as "Check Current Price on Amazon" rather than stating an exact dollar figure.',
      '### 3. Star Ratings and Customer Reviews',
      'You are not permitted to copy customer reviews word-for-word from Amazon into your blog posts. Instead, summarize aggregate customer sentiment or rely on manufacturer specifications.',
    ],
  },
  {
    slug: 'schema-markup-affiliate-rich-snippets',
    title: 'Product Schema Markup: Winning Google Rich Snippets for Affiliate Sites',
    category: 'SEO',
    excerpt:
      'How to implement valid JSON-LD Product, Review, and FAQPage schemas to capture valuable search engine real estate and boost organic CTR.',
    date: 'September 4, 2026',
    readTime: '5 min read',
    author: 'SEO Technical Architect',
    content: [
      'Structured data (JSON-LD) helps search crawlers understand the entities on your webpage. For affiliate blogs, schema markup can unlock star ratings, pricing ranges, and expandable FAQ dropdowns directly in search results.',
      '### Key Schemas for Product Reviews',
      '1. **Product Schema**: Identifies the item name, brand, model, and category.',
      '2. **Review Schema**: Attributes the review to your author or publication.',
      '3. **FAQPage Schema**: Marks up your 8-10 frequently asked questions, allowing Google to display interactive accordions on mobile search.',
      'Always test your generated JSON-LD using Google’s Rich Results Test tool before deploying to production.',
    ],
  },
];

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Product Reviews', 'Compliance', 'SEO'];

  const filteredPosts =
    categoryFilter === 'All'
      ? POSTS
      : POSTS.filter((p) => p.category === categoryFilter);

  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Publisher Knowledge Base
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Affiliate Strategy & SEO Editorial Blog
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Actionable guides on Amazon Associates compliance, content velocity, and SEO
            architecture.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8 space-y-10">
        {selectedPost ? (
          /* Single Article Reader View */
          <div>
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </button>

            <article className="mt-6">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                {selectedPost.category}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {selectedPost.title}
              </h1>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
                <span>By {selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>

              {/* In-article AdSlot */}
              <div className="my-6">
                <AdSlot placement="in-content" />
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
                {selectedPost.content.map((p, idx) => {
                  if (p.startsWith('### ')) {
                    return (
                      <h2 key={idx} className="mt-6 text-lg font-bold text-slate-900">
                        {p.replace('### ', '')}
                      </h2>
                    );
                  }
                  return <p key={idx}>{p}</p>;
                })}
              </div>
            </article>
          </div>
        ) : (
          /* Blog Posts Grid */
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.slug}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">• {post.readTime}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-orange-600">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdSlot placement="article-bottom" />
      </div>
    </div>
  );
};
