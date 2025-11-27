import { mutation } from "./_generated/server";
import { auth } from "./auth";

/**
 * Assign STAFF role to the current user
 * This should be called immediately after the staff account is created
 */
export const assignStaffRole = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if role already exists
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingRole) {
      // Update to STAFF if not already
      if (existingRole.role !== "STAFF") {
        await ctx.db.patch(existingRole._id, { role: "STAFF" });
      }
    } else {
      // Create new STAFF role assignment
      await ctx.db.insert("userRoles", {
        userId: userId,
        role: "STAFF",
      });
    }

    return { success: true, role: "STAFF" };
  },
});

