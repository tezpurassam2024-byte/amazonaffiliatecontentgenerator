import { GeneratedArticleContent, AmazonProduct } from '../types';
import { buildAffiliateUrl } from './amazon';

export function generateFullMarkdown(
  product: AmazonProduct,
  content: GeneratedArticleContent,
  affiliateTag?: string
): string {
  if (content.raw_markdown) {
    return content.raw_markdown;
  }

  const title =
    content.seo_titles?.selected ||
    content.seo_titles?.options?.[0] ||
    product.product_name;
  const affiliateUrl = buildAffiliateUrl(
    product.amazon_url,
    product.asin,
    product.marketplace,
    affiliateTag
  );
  const review = content.review || ({} as any);

  let md = `# ${title}\n\n`;

  if (content.affiliate_disclosure) {
    md += `> **Affiliate Disclosure:** ${content.affiliate_disclosure}\n\n`;
  }

  if (product.image_url) {
    md += `![${content.image_seo?.alt_text || product.product_name}](${product.image_url})\n\n`;
    if (content.image_seo?.caption) {
      md += `*${content.image_seo.caption}*\n\n`;
    }
  }

  if (review.introduction) {
    md += `## Introduction\n\n${review.introduction}\n\n`;
  }

  md += `[![Check Price on Amazon](https://img.shields.io/badge/Amazon-Check%20Current%20Price-orange?style=for-the-badge&logo=amazon)](${affiliateUrl})\n\n`;

  if (review.key_features) {
    md += `## Key Features\n\n${review.key_features}\n\n`;
  }

  if (review.design_and_build) {
    md += `## Design & Build Quality\n\n${review.design_and_build}\n\n`;
  }

  if (review.performance_usage) {
    md += `## Performance & Everyday Usage\n\n${review.performance_usage}\n\n`;
  }

  if (review.features_deep_dive) {
    md += `## Features Deep Dive\n\n${review.features_deep_dive}\n\n`;
  }

  if (content.pros_cons?.pros?.length || content.pros_cons?.cons?.length) {
    md += `## Pros & Cons\n\n`;
    md += `### What We Like\n\n`;
    (content.pros_cons?.pros || []).forEach((p) => {
      md += `- ${p}\n`;
    });
    md += `\n### What Could Be Improved\n\n`;
    (content.pros_cons?.cons || []).forEach((c) => {
      md += `- ${c}\n`;
    });
    md += `\n`;
  }

  if (product.specifications?.length) {
    md += `## Product Specifications\n\n`;
    md += `| Specification | Detail |\n| --- | --- |\n`;
    product.specifications.forEach((s) => {
      md += `| ${s.name} | ${s.value} |\n`;
    });
    md += `\n`;
  }

  if (content.faqs?.length) {
    md += `## Frequently Asked Questions\n\n`;
    content.faqs.forEach((faq) => {
      md += `### ${faq.question}\n\n${faq.answer}\n\n`;
    });
  }

  if (review.who_should_buy) {
    md += `## Who Should Buy This?\n\n${review.who_should_buy}\n\n`;
  }

  if (review.who_should_consider_alternatives) {
    md += `## Alternatives to Consider\n\n${review.who_should_consider_alternatives}\n\n`;
  }

  if (review.final_verdict) {
    md += `## Final Verdict\n\n${review.final_verdict}\n\n`;
  }

  md += `[View ${product.product_name} on Amazon](${affiliateUrl})\n`;

  return md;
}

export function generateCleanHtml(
  product: AmazonProduct,
  content: GeneratedArticleContent,
  affiliateTag?: string
): string {
  const title =
    content.seo_titles?.selected ||
    content.seo_titles?.options?.[0] ||
    product.product_name;
  const affiliateUrl = buildAffiliateUrl(
    product.amazon_url,
    product.asin,
    product.marketplace,
    affiliateTag
  );
  const review = content.review || ({} as any);

  let html = `<article class="amazon-affiliate-review">\n`;
  html += `  <header class="review-header">\n`;
  html += `    <h1>${escapeHtml(title)}</h1>\n`;
  if (content.affiliate_disclosure) {
    html += `    <div class="affiliate-disclosure"><p><em><strong>Affiliate Disclosure:</strong> ${escapeHtml(
      content.affiliate_disclosure
    )}</em></p></div>\n`;
  }
  html += `  </header>\n\n`;

  if (product.image_url) {
    html += `  <figure class="featured-image">\n`;
    html += `    <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(
      content.image_seo?.alt_text || product.product_name
    )}" loading="lazy" />\n`;
    if (content.image_seo?.caption) {
      html += `    <figcaption>${escapeHtml(content.image_seo.caption)}</figcaption>\n`;
    }
    html += `  </figure>\n\n`;
  }

  if (review.introduction) {
    html += `  <section class="review-intro">\n`;
    html += `    <h2>Introduction</h2>\n`;
    html += `    <p>${escapeHtml(review.introduction)}</p>\n`;
    html += `  </section>\n\n`;
  }

  html += `  <div class="cta-box" style="margin: 24px 0; text-align: center;">\n`;
  html += `    <a href="${escapeHtml(
    affiliateUrl
  )}" rel="sponsored nofollow noopener" target="_blank" class="buy-button" style="display:inline-block; background-color: #ff9900; color: #111; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px;">Check Price on Amazon</a>\n`;
  html += `  </div>\n\n`;

  if (review.key_features) {
    html += `  <section class="review-section">\n    <h2>Key Features</h2>\n    <p>${escapeHtml(
      review.key_features
    )}</p>\n  </section>\n\n`;
  }

  if (review.design_and_build) {
    html += `  <section class="review-section">\n    <h2>Design and Build Quality</h2>\n    <p>${escapeHtml(
      review.design_and_build
    )}</p>\n  </section>\n\n`;
  }

  if (review.performance_usage) {
    html += `  <section class="review-section">\n    <h2>Performance and Real-World Usage</h2>\n    <p>${escapeHtml(
      review.performance_usage
    )}</p>\n  </section>\n\n`;
  }

  if (content.pros_cons?.pros?.length || content.pros_cons?.cons?.length) {
    html += `  <section class="pros-cons-grid">\n`;
    html += `    <h2>Pros and Cons</h2>\n`;
    html += `    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">\n`;
    html += `      <div class="pros" style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e;">\n`;
    html += `        <h3>Pros</h3>\n        <ul>\n`;
    (content.pros_cons?.pros || []).forEach((p) => {
      html += `          <li>${escapeHtml(p)}</li>\n`;
    });
    html += `        </ul>\n      </div>\n`;

    html += `      <div class="cons" style="background: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444;">\n`;
    html += `        <h3>Cons</h3>\n        <ul>\n`;
    (content.pros_cons?.cons || []).forEach((c) => {
      html += `          <li>${escapeHtml(c)}</li>\n`;
    });
    html += `        </ul>\n      </div>\n`;
    html += `    </div>\n  </section>\n\n`;
  }

  if (product.specifications?.length) {
    html += `  <section class="specifications-table">\n`;
    html += `    <h2>Product Specifications</h2>\n`;
    html += `    <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; margin-top: 12px;">\n`;
    html += `      <thead>\n        <tr style="background: #f8fafc;">\n          <th style="text-align: left;">Feature</th>\n          <th style="text-align: left;">Specification</th>\n        </tr>\n      </thead>\n      <tbody>\n`;
    product.specifications.forEach((s) => {
      html += `        <tr>\n          <td><strong>${escapeHtml(s.name)}</strong></td>\n          <td>${escapeHtml(
        s.value
      )}</td>\n        </tr>\n`;
    });
    html += `      </tbody>\n    </table>\n  </section>\n\n`;
  }

  if (content.faqs?.length) {
    html += `  <section class="faq-section">\n    <h2>Frequently Asked Questions</h2>\n`;
    content.faqs.forEach((faq) => {
      html += `    <div class="faq-item">\n      <h3>${escapeHtml(faq.question)}</h3>\n      <p>${escapeHtml(
        faq.answer
      )}</p>\n    </div>\n`;
    });
    html += `  </section>\n\n`;
  }

  if (review.final_verdict) {
    html += `  <section class="verdict-section">\n    <h2>Final Verdict</h2>\n    <p>${escapeHtml(
      review.final_verdict
    )}</p>\n  </section>\n\n`;
  }

  html += `  <footer class="review-footer">\n`;
  html += `    <p><a href="${escapeHtml(
    affiliateUrl
  )}" rel="sponsored nofollow noopener" target="_blank">View ${escapeHtml(
    product.product_name
  )} on Amazon</a></p>\n`;
  html += `  </footer>\n`;
  html += `</article>\n`;

  // Append schema if present
  if (content.schema_markup?.product_schema) {
    html += `\n<script type="application/ld+json">\n${content.schema_markup.product_schema}\n</script>\n`;
  }

  return html;
}

export function generatePlainText(
  product: AmazonProduct,
  content: GeneratedArticleContent,
  affiliateTag?: string
): string {
  const md = generateFullMarkdown(product, content, affiliateTag);
  return md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/`([^`]+)`/g, '$1');
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
