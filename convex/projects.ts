import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    sector: v.string(),
    budget: v.number(),
    region: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    const projectId = await ctx.db.insert("projects", {
      ...args,
      userId,
      createdAt: Date.now(),
    });
    return projectId;
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    return await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    const project = await ctx.db.get(args.id);
    if (!project || project.userId !== userId) {
      return null;
    }
    return project;
  },
});

export const updateProjectStatus = mutation({
  args: { id: v.id("projects"), status: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    const project = await ctx.db.get(args.id);
    if (!project || project.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.id, { status: args.status });
  },
});
