import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

export const update = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.optional(v.union(v.literal('free'), v.literal('pro'), v.literal('business'))),
    generations_used: v.optional(v.number()),
    generations_limit: v.optional(v.number()),
    amazon_associate_tag: v.optional(v.string()),
    default_marketplace: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing: any = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.plan !== undefined && { plan: args.plan }),
        ...(args.generations_used !== undefined && { generations_used: args.generations_used }),
        ...(args.generations_limit !== undefined && { generations_limit: args.generations_limit }),
        ...(args.amazon_associate_tag !== undefined && { amazon_associate_tag: args.amazon_associate_tag }),
        ...(args.default_marketplace !== undefined && { default_marketplace: args.default_marketplace }),
      });
      return existing._id;
    } else {
      return await ctx.db.insert('users', {
        email: args.email,
        name: args.name || '',
        plan: args.plan || 'free',
        generations_used: args.generations_used || 0,
        generations_limit: args.generations_limit || 5,
        amazon_associate_tag: args.amazon_associate_tag || '',
        default_marketplace: args.default_marketplace || 'com',
        created_at: new Date().toISOString(),
      });
    }
  },
});

export const incrementUsage = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user: any = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        generations_used: (Number(user.generations_used) || 0) + 1,
      });
    }
  },
});
