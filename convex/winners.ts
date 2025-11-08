import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Confirm a winner and save to database
 * Saves denormalized participant data for easy export and data integrity
 */
export const confirmWinner = mutation({
  args: {
    participantId: v.id("participants"),
  },
  returns: v.id("winners"),
  handler: async (ctx, args) => {
    // Get participant details
    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new Error("Participant not found");
    }

    // Save winner with denormalized data
    const winnerId = await ctx.db.insert("winners", {
      participantId: args.participantId,
      participantName: participant.fullName,
      participantDepartment: participant.department,
    });

    return winnerId;
  },
});

/**
 * Get all winners (for winner history page)
 * Returns winners sorted by creation time (newest first)
 */
export const listWinners = query({
  args: {},
  handler: async (ctx) => {
    const winners = await ctx.db.query("winners").collect();

    // Sort by _creationTime descending (newest first)
    return winners.sort((a, b) => b._creationTime - a._creationTime);
  },
});

/**
 * Get total winner count (for dashboard stats)
 */
export const getWinnerCount = query({
  args: {},
  handler: async (ctx) => {
    const winners = await ctx.db.query("winners").collect();
    return winners.length;
  },
});

/**
 * Check if a participant has already won
 * Used to prevent duplicate winners or show winner badge
 */
export const checkIfWinner = query({
  args: {
    participantId: v.id("participants"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const winner = await ctx.db
      .query("winners")
      .withIndex("by_participant", (q) =>
        q.eq("participantId", args.participantId),
      )
      .first();

    return winner !== null;
  },
});
