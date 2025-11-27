import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Get the role of the currently authenticated user
 */
export const getCurrentUserRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return roleRecord?.role ?? null;
  },
});

/**
 * Get user role by user ID (for internal use)
 */
export const getUserRole = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return roleRecord?.role ?? null;
  },
});

/**
 * Assign a role to a user
 * This should only be called during user creation
 */
export const assignRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("ADMIN"), v.literal("STAFF")),
  },
  handler: async (ctx, args) => {
    // Check if role already exists
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingRole) {
      // Update existing role
      await ctx.db.patch(existingRole._id, { role: args.role });
    } else {
      // Create new role assignment
      await ctx.db.insert("userRoles", {
        userId: args.userId,
        role: args.role,
      });
    }

    return { success: true };
  },
});

/**
 * Check if the current user has a specific role
 */
export const hasRole = query({
  args: { role: v.union(v.literal("ADMIN"), v.literal("STAFF")) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return false;
    }

    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return roleRecord?.role === args.role;
  },
});

/**
 * Check if the current user is an admin
 */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return false;
    }

    const roleRecord = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return roleRecord?.role === "ADMIN";
  },
});

/**
 * Check if there is any user with ADMIN role in the system
 */
export const hasAdminUser = query({
  args: {},
  handler: async (ctx) => {
    const adminRole = await ctx.db.query("userRoles").collect();

    return adminRole.some((role) => role.role === "ADMIN");
  },
});
