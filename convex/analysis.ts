import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveAnalysis = mutation({
  args: {
    projectId: v.id("projects"),
    score: v.number(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    administrative_steps: v.array(v.string()),
    suggestions: v.array(v.string()),
    estimated_timeline: v.string(),
    risk_level: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    const analysisId = await ctx.db.insert("analysis", {
      ...args,
      userId,
    });
    return analysisId;
  },
});

export const getAnalysisByProjectId = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call");
    }
    const userId = identity.subject;

    const analysis = await ctx.db
      .query("analysis")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .first();

    if (analysis && analysis.userId !== userId) {
      return null; // Ensure the user can only access their own analyses
    }

    return analysis;
  },
});
