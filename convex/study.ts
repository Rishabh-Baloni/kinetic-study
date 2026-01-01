import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Test auth query
export const testAuth = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      isAuthenticated: !!identity,
      identity: identity,
    };
  },
});

// Create a new study session
export const createStudySession = mutation({
  args: {
    subject: v.string(),
    topic: v.string(),
    goal: v.string(),
    totalDuration: v.number(),
    tasks: v.array(
      v.object({
        type: v.string(),
        task: v.string(),
        time: v.number(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Deactivate any existing active sessions
    const existingSessions = await ctx.db
      .query("studySessions")
      .withIndex("by_active", (q) =>
        q.eq("userId", identity.subject).eq("isActive", true)
      )
      .collect();

    for (const session of existingSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    // Create new session
    const sessionId = await ctx.db.insert("studySessions", {
      userId: identity.subject,
      subject: args.subject,
      topic: args.topic,
      goal: args.goal,
      totalDuration: args.totalDuration,
      tasks: args.tasks,
      isActive: true,
      createdAt: Date.now(),
    });

    return sessionId;
  },
});

// Get active study session
export const getActiveSession = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const session = await ctx.db
      .query("studySessions")
      .withIndex("by_active", (q) =>
        q.eq("userId", identity.subject).eq("isActive", true)
      )
      .first();

    if (!session) return null;

    // Get task completions for this session
    const completions = await ctx.db
      .query("taskCompletions")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .collect();

    return {
      ...session,
      completions,
    };
  },
});

// Complete a task
export const completeTask = mutation({
  args: {
    sessionId: v.id("studySessions"),
    taskIndex: v.number(),
    timeSpent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("taskCompletions", {
      userId: identity.subject,
      sessionId: args.sessionId,
      taskIndex: args.taskIndex,
      completedAt: Date.now(),
      timeSpent: args.timeSpent,
    });
  },
});

// Complete session with confidence rating
export const completeSession = mutation({
  args: {
    sessionId: v.id("studySessions"),
    confidenceScore: v.number(),
    quizScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Mark session as complete
    await ctx.db.patch(args.sessionId, {
      isActive: false,
      completedAt: Date.now(),
      confidenceScore: args.confidenceScore,
      quizScore: args.quizScore,
    });

    // Schedule revisions
    const now = Date.now();
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("revisionSchedule", {
      userId: identity.subject,
      sessionId: args.sessionId,
      subject: session.subject,
      topic: session.topic,
      scheduledFor: now + twoDays,
      type: "day2",
      completed: false,
      createdAt: now,
    });

    await ctx.db.insert("revisionSchedule", {
      userId: identity.subject,
      sessionId: args.sessionId,
      subject: session.subject,
      topic: session.topic,
      scheduledFor: now + sevenDays,
      type: "day7",
      completed: false,
      createdAt: now,
    });
  },
});

// Get revision schedule
export const getRevisionSchedule = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const revisions = await ctx.db
      .query("revisionSchedule")
      .withIndex("by_user_completed", (q) =>
        q.eq("userId", identity.subject).eq("completed", false)
      )
      .collect();

    return revisions.sort((a, b) => a.scheduledFor - b.scheduledFor);
  },
});

// Complete a revision
export const completeRevision = mutation({
  args: {
    revisionId: v.id("revisionSchedule"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.revisionId, {
      completed: true,
    });
  },
});

// Get user stats
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const allSessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    const completedSessions = allSessions.filter((s) => s.completedAt);
    const totalMinutes = completedSessions.reduce(
      (sum, s) => sum + s.totalDuration,
      0
    );

    // Calculate streak
    const sortedSessions = completedSessions
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    
    let streak = 0;
    let lastDate = "";
    
    for (const session of sortedSessions) {
      if (!session.completedAt) continue;
      
      const sessionDate = new Date(session.completedAt).toDateString();
      if (lastDate === "") {
        lastDate = sessionDate;
        streak = 1;
      } else {
        const prevDate = new Date(lastDate);
        const currDate = new Date(sessionDate);
        const diffDays = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (diffDays === 1) {
          streak++;
          lastDate = sessionDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    return {
      totalSessions: completedSessions.length,
      totalMinutes,
      averageConfidence: completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.confidenceScore || 0), 0) /
          completedSessions.length
        : 0,
      streak,
    };
  },
});

// Get session history
export const getSessionHistory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_created", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(20);

    return sessions;
  },
});
