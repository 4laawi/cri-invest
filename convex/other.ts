import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createAppointment = mutation({
  args: {
    name: v.string(),
    project: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    return await ctx.db.insert("appointments", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
  },
});

export const getFaqs = query({
  handler: async (ctx) => {
    return await ctx.db.query("faqs").order("desc").collect();
  },
});
