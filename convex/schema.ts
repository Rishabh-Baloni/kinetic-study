import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  studySessions: defineTable({
    userId: v.string(),
    subject: v.string(), // "DBMS", "OS", "CN", "DSA", "OOP", "Math"
    topic: v.string(),
    goal: v.string(), // "Exam", "Placement", "Both"
    totalDuration: v.number(), // 60, 90, or 120
    tasks: v.array(
      v.object({
        type: v.string(), // "read", "watch", "practice", "recall", "interview"
        task: v.string(),
        time: v.number(),
        order: v.number(),
      })
    ),
    isActive: v.boolean(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    confidenceScore: v.optional(v.number()), // 1-5
    quizScore: v.optional(v.number()), // 0-5 (number of correct answers)
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["userId", "isActive"])
    .index("by_created", ["userId", "createdAt"]),

  taskCompletions: defineTable({
    userId: v.string(),
    sessionId: v.string(),
    taskIndex: v.number(),
    completedAt: v.number(),
    timeSpent: v.optional(v.number()), // actual minutes spent
  })
    .index("by_session", ["sessionId"])
    .index("by_user_session", ["userId", "sessionId"]),

  revisionSchedule: defineTable({
    userId: v.string(),
    sessionId: v.string(),
    subject: v.string(),
    topic: v.string(),
    scheduledFor: v.number(), // timestamp
    type: v.string(), // "day2" or "day7"
    completed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user_scheduled", ["userId", "scheduledFor"])
    .index("by_user_completed", ["userId", "completed"]),
});