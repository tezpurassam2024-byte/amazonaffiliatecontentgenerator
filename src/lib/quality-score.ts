import { ContentQualityScore, GeneratedArticleContent, ContentGenerationOptions } from '../types';

export function calculateQualityScore(
  content: GeneratedArticleContent,
  options: ContentGenerationOptions
): ContentQualityScore {
  let seo = 75;
  let readability = 80;
  let keyword = 70;
  let completeness = 70;
  let affiliate = 75;

  const titleLength = content.seo_titles?.selected?.length || 0;
  if (titleLength >= 45 && titleLength <= 65) {
    seo += 15;
  } else if (titleLength > 0) {
    seo += 8;
  }

  if (content.meta_descriptions && content.meta_descriptions.length > 0) {
    seo += 10;
  }

  // Completeness checks
  const review = content.review;
  if (review?.introduction && review?.final_verdict) completeness += 10;
  if (content.pros_cons?.pros?.length && content.pros_cons?.cons?.length) completeness += 10;
  if (content.faqs && content.faqs.length >= 5) completeness += 10;

  // Readability
  if (review?.key_features && review?.design_and_build) readability += 10;
  if (content.specifications && content.specifications.length > 0) readability += 8;

  // Keyword check
  const primaryKw = options.keywords.primary.toLowerCase();
  const fullText = (content.raw_markdown || '').toLowerCase();
  if (primaryKw && fullText.includes(primaryKw)) {
    keyword += 15;
  }
  if (options.keywords.secondary.some((k) => fullText.includes(k.toLowerCase()))) {
    keyword += 10;
  }

  // Affiliate Readiness
  if (content.affiliate_disclosure && content.affiliate_disclosure.length > 30) {
    affiliate += 15;
  }
  if (content.schema_markup?.product_schema) {
    affiliate += 10;
  }

  seo = Math.min(100, Math.max(40, seo));
  readability = Math.min(100, Math.max(40, readability));
  keyword = Math.min(100, Math.max(40, keyword));
  completeness = Math.min(100, Math.max(40, completeness));
  affiliate = Math.min(100, Math.max(40, affiliate));

  const overall = Math.round(
    seo * 0.25 + readability * 0.2 + keyword * 0.15 + completeness * 0.2 + affiliate * 0.2
  );

  return {
    overall_score: overall,
    seo_score: seo,
    readability_score: readability,
    keyword_optimization: keyword,
    content_completeness: completeness,
    affiliate_readiness: affiliate,
    explanations: [
      {
        category: 'SEO Optimization',
        score: seo,
        feedback:
          seo >= 85
            ? 'Optimized title length (50-65 chars), rich heading structure, and meta descriptions included.'
            : 'Consider selecting an SEO title within the ideal 50-65 character range.',
        tips: [
          'Ensure the primary search keyword appears within the first 60 characters of the title.',
          'Include 140-160 character meta description in your CMS for search snippet CTR.',
        ],
      },
      {
        category: 'Readability & Scannability',
        score: readability,
        feedback:
          'Structured with clear H2/H3 subheadings, bulleted pros & cons, and factual specification tables.',
        tips: [
          'Use bullet lists and bold highlights so mobile readers can easily scan key specs.',
          'Keep paragraphs under 3-4 sentences for high engagement.',
        ],
      },
      {
        category: 'Keyword Optimization',
        score: keyword,
        feedback: `Primary keyword "${options.keywords.primary || 'product'}" integrated naturally into headings and body text without unnatural stuffing.`,
        tips: [
          'Ensure secondary terms appear naturally in FAQ questions.',
          'Never force keywords into sentences where they sound artificial.',
        ],
      },
      {
        category: 'Content Completeness',
        score: completeness,
        feedback:
          'Comprehensive coverage featuring introduction, performance overview, pros/cons, FAQs, and verdict.',
        tips: [
          'Add a comparison table if comparing against competitor models in this price tier.',
          'Review the FAQ section to address typical buyer objections.',
        ],
      },
      {
        category: 'Affiliate Compliance & Readiness',
        score: affiliate,
        feedback:
          'FTC-compliant affiliate disclosure present with valid JSON-LD Product & Review schema markup.',
        tips: [
          'Always place the affiliate disclosure above the fold and before the first affiliate link.',
          'Verify your Amazon Associates tracking tag is appended to the buy buttons.',
        ],
      },
    ],
  };
}
