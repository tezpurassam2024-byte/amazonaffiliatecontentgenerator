import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('business')),
    generations_used: v.number(),
    generations_limit: v.number(),
    amazon_associate_tag: v.string(),
    default_marketplace: v.string(),
    is_admin: v.optional(v.boolean()),
    created_at: v.string(),
  }).index('by_email', ['email']),

  products: defineTable({
    asin: v.string(),
    marketplace: v.string(),
    product_name: v.string(),
    brand: v.string(),
    model: v.optional(v.string()),
    category: v.string(),
    price: v.optional(v.string()),
    rating: v.optional(v.number()),
    review_count: v.optional(v.number()),
    image_url: v.optional(v.string()),
    amazon_url: v.string(),
    key_features: v.array(v.string()),
    specifications: v.array(
      v.object({
        name: v.string(),
        value: v.string(),
      })
    ),
    description: v.optional(v.string()),
    source: v.union(v.literal('url'), v.literal('manual'), v.literal('api')),
    created_at: v.optional(v.string()),
  }).index('by_asin', ['asin']),

  articles: defineTable({
    user_id: v.string(),
    product_id: v.optional(v.string()),
    title: v.string(),
    status: v.union(
      v.literal('Draft'),
      v.literal('Generated'),
      v.literal('Edited'),
      v.literal('Published')
    ),
    product: v.any(),
    content: v.any(),
    options: v.any(),
    versions: v.optional(v.any()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index('by_user_id', ['user_id'])
    .index('by_status', ['status']),

  comparisons: defineTable({
    article_id: v.optional(v.string()),
    user_id: v.string(),
    comparison_data: v.any(),
    created_at: v.string(),
  }).index('by_user_id', ['user_id']),

  logs: defineTable({
    timestamp: v.string(),
    type: v.union(v.literal('info'), v.literal('warn'), v.literal('error')),
    message: v.string(),
  }),

  appointments: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    service_type: v.string(),
    date: v.string(),
    time_slot: v.string(),
    timezone: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    created_at: v.string(),
  })
    .index('by_email', ['email'])
    .index('by_date', ['date'])
    .index('by_status', ['status']),
});
