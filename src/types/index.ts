export type MarketplaceId =
  | 'com'
  | 'in'
  | 'co.uk'
  | 'ca'
  | 'com.au'
  | 'de'
  | 'fr'
  | 'it'
  | 'es'
  | 'co.jp';

export interface AmazonMarketplace {
  id: MarketplaceId;
  name: string;
  domain: string;
  country: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface AmazonProduct {
  id: string;
  asin: string;
  marketplace: MarketplaceId;
  product_name: string;
  brand: string;
  model?: string;
  category: string;
  price?: string;
  rating?: number;
  review_count?: number;
  image_url?: string;
  amazon_url: string;
  key_features: string[];
  specifications: ProductSpecification[];
  description?: string;
  source: 'url' | 'manual' | 'api';
  created_at?: string;
}

export interface ContentGenerationOptions {
  modules: {
    seo_title: boolean;
    review: boolean;
    pros_cons: boolean;
    specifications: boolean;
    comparison: boolean;
    faq: boolean;
    meta_title: boolean;
    meta_description: boolean;
    image_caption: boolean;
    schema_markup: boolean;
    affiliate_disclosure: boolean;
    social_media: boolean;
  };
  review_length: '500' | '1000' | '1500' | '2000';
  writing_style:
    | 'Professional'
    | 'Friendly'
    | 'Conversational'
    | 'Technical'
    | 'Beginner-friendly'
    | 'Review-style'
    | 'Buying-guide style';
  target_audience:
    | 'General consumers'
    | 'Tech enthusiasts'
    | 'Professionals'
    | 'Students'
    | 'Parents'
    | 'Gamers'
    | 'Photographers'
    | 'Budget shoppers';
  seo_intensity: 'Natural' | 'Standard SEO' | 'Strong SEO';
  keywords: {
    primary: string;
    secondary: string[];
    long_tail: string[];
  };
  affiliate_tag?: string;
}

export interface GeneratedSEOTitles {
  selected: string;
  options: string[];
}

export interface GeneratedReviewSection {
  heading: string;
  content: string;
}

export interface GeneratedReview {
  word_count: number;
  introduction: string;
  key_features: string;
  design_and_build: string;
  performance_usage: string;
  features_deep_dive: string;
  pros: string[];
  cons: string[];
  who_should_buy: string;
  who_should_consider_alternatives: string;
  final_verdict: string;
}

export interface ComparisonProduct {
  name: string;
  asin?: string;
  price?: string;
  rating?: number;
  attributes: Record<string, string>;
}

export interface GeneratedComparisonTable {
  category_attributes: string[];
  main_product: ComparisonProduct;
  comparison_products: ComparisonProduct[];
  verdict: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GeneratedSocialPosts {
  facebook: string[];
  twitter: string[];
  linkedin: string[];
  instagram: string[];
  pinterest: string[];
  youtube_community: string;
}

export interface GeneratedArticleContent {
  seo_titles?: GeneratedSEOTitles;
  review?: GeneratedReview;
  pros_cons?: {
    pros: string[];
    cons: string[];
  };
  specifications?: ProductSpecification[];
  comparison?: GeneratedComparisonTable;
  faqs?: FAQItem[];
  meta_titles?: string[];
  selected_meta_title?: string;
  meta_descriptions?: string[];
  selected_meta_description?: string;
  image_seo?: {
    caption: string;
    alt_text: string;
    short_description: string;
  };
  schema_markup?: {
    product_schema: string;
    faq_schema: string;
    article_schema: string;
  };
  affiliate_disclosure?: string;
  social_media?: GeneratedSocialPosts;
  raw_markdown?: string;
}

export type ArticleStatus = 'Draft' | 'Generated' | 'Edited' | 'Published';

export interface Article {
  id: string;
  user_id: string;
  product_id?: string;
  product: AmazonProduct;
  title: string;
  content: GeneratedArticleContent;
  options: ContentGenerationOptions;
  status: ArticleStatus;
  versions?: {
    id: string;
    created_at: string;
    label: string;
    content: GeneratedArticleContent;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ContentQualityScore {
  overall_score: number;
  seo_score: number;
  readability_score: number;
  keyword_optimization: number;
  content_completeness: number;
  affiliate_readiness: number;
  explanations: {
    category: string;
    score: number;
    feedback: string;
    tips: string[];
  }[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'business';
  generations_used: number;
  generations_limit: number;
  amazon_associate_tag: string;
  default_marketplace: MarketplaceId;
  is_admin?: boolean;
  created_at: string;
}

export interface AdminMetrics {
  total_users: number;
  new_users_today: number;
  total_articles: number;
  total_generations: number;
  generations_this_month: number;
  top_categories: { category: string; count: number }[];
  top_marketplaces: { marketplace: string; count: number }[];
  recent_logs: {
    id: string;
    timestamp: string;
    type: 'info' | 'warn' | 'error';
    message: string;
  }[];
}

export interface AppointmentBooking {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type: string;
  date: string;
  time_slot: string;
  timezone?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

