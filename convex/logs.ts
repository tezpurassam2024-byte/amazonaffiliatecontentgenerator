import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('logs')
      .order('desc')
      .take(args.limit || 50);
  },
});

export const add = mutation({
  args: {
    type: v.union(v.literal('info'), v.literal('warn'), v.literal('error')),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('logs', {
      type: args.type,
      message: args.message,
      timestamp: new Date().toISOString(),
    });
  },
});
