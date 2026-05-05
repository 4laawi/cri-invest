import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    sector: v.string(),
    budget: v.number(),
    region: v.string(),
    status: v.string(), // "Brouillon", "Soumis", "Analysé"
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  analysis: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    score: v.number(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    administrative_steps: v.array(v.string()),
    suggestions: v.array(v.string()),
    estimated_timeline: v.string(),
    risk_level: v.string(),
  }).index("by_userId", ["userId"]),
  appointments: defineTable({
    userId: v.string(),
    name: v.string(),
    project: v.string(),
    date: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    createdAt: v.number(),
  }),
});
