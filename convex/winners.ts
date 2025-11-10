import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Confirm a winner and save to database
 * Saves denormalized participant and prize data for easy export and data integrity
 * Also marks the prize as "won" if a prize is assigned
 */
export const confirmWinner = mutation({
  args: {
    participantId: v.id("participants"),
    prizeId: v.optional(v.id("prizes")),
  },
  returns: v.id("winners"),
  handler: async (ctx, args) => {
    // Get participant details
    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new Error("Participant not found");
    }

    // Get prize details if prizeId is provided
    let prizeName: string | undefined;
    let prizeImageStorageId: Id<"_storage"> | undefined;

    if (args.prizeId) {
      const prize = await ctx.db.get(args.prizeId);
      if (!prize) {
        throw new Error("Prize not found");
      }

      // Check if prize is already won
      if (prize.status === "won") {
        throw new Error("This prize has already been won");
      }

      prizeName = prize.name;
      prizeImageStorageId = prize.imageStorageId;

      // Mark prize as won
      await ctx.db.patch(args.prizeId, {
        status: "won",
      });
    }

    // Save winner with denormalized data
    const winnerId = await ctx.db.insert("winners", {
      participantId: args.participantId,
      participantName: participant.fullName,
      participantDepartment: participant.department,
      prizeId: args.prizeId,
      prizeName,
      prizeImageStorageId,
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
