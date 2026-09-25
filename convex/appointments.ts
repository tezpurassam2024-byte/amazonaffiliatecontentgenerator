import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    email: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.email) {
      return await ctx.db
        .query('appointments')
        .withIndex('by_email', (q) => q.eq('email', args.email!))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('appointments').order('desc').collect();
  },
});

export const get = query({
  args: { id: v.id('appointments') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const book = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    service_type: v.string(),
    date: v.string(),
    time_slot: v.string(),
    timezone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const appointmentId = await ctx.db.insert('appointments', {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone ? args.phone.trim() : undefined,
      company: args.company ? args.company.trim() : undefined,
      service_type: args.service_type,
      date: args.date,
      time_slot: args.time_slot,
      timezone: args.timezone || 'UTC',
      notes: args.notes ? args.notes.trim() : undefined,
      status: 'pending',
      created_at: now,
    });

    // Also record an audit log in convex logs table
    await ctx.db.insert('logs', {
      timestamp: now,
      type: 'info',
      message: `New appointment booked by ${args.name} (${args.email}) for ${args.service_type} on ${args.date} at ${args.time_slot}`,
    });

    return {
      success: true,
      appointmentId,
      message: 'Appointment successfully scheduled and saved in Convex database!',
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('appointments'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    });
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
