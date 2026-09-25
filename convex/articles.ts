import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query('articles')
        .withIndex('by_user_id', (q) => q.eq('user_id', args.userId!))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('articles').order('desc').collect();
  },
});

export const get = query({
  args: { id: v.id('articles') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.id('articles')),
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
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    if (args.id) {
      const { id, ...data } = args;
      await ctx.db.patch(id, {
        ...data,
        updated_at: now,
      });
      return id;
    } else {
      const { id, ...data } = args;
      return await ctx.db.insert('articles', {
        ...data,
        created_at: now,
        updated_at: now,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id('articles') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
