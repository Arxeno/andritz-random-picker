import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Add a new prize
 */
export const addPrize = mutation({
  args: {
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim()) {
      throw new Error("Prize name is required");
    }

    const prizeId = await ctx.db.insert("prizes", {
      name: args.name.trim(),
      imageStorageId: args.imageStorageId,
      status: "available", // New prizes are always available
    });

    return prizeId;
  },
});

/**
 * List all prizes
 */
export const listPrizes = query({
  args: {},
  handler: async (ctx) => {
    const prizes = await ctx.db.query("prizes").collect();
    return prizes.sort((a, b) => b._creationTime - a._creationTime);
  },
});

/**
 * Get a single prize by ID
 */
export const getPrize = query({
  args: { prizeId: v.id("prizes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.prizeId);
  },
});

/**
 * Update a prize
 */
export const updatePrize = mutation({
  args: {
    prizeId: v.id("prizes"),
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim()) {
      throw new Error("Prize name is required");
    }

    const prize = await ctx.db.get(args.prizeId);
    if (!prize) {
      throw new Error("Prize not found");
    }

    // Delete old image if it exists and a new one is provided
    if (
      prize.imageStorageId &&
      args.imageStorageId &&
      prize.imageStorageId !== args.imageStorageId
    ) {
      await ctx.storage.delete(prize.imageStorageId);
    }

    await ctx.db.patch(args.prizeId, {
      name: args.name.trim(),
      imageStorageId: args.imageStorageId,
      // Keep existing status when updating
    });

    return args.prizeId;
  },
});

/**
 * Delete a prize
 */
export const deletePrize = mutation({
  args: { prizeId: v.id("prizes") },
  handler: async (ctx, args) => {
    const prize = await ctx.db.get(args.prizeId);
    if (!prize) {
      throw new Error("Prize not found");
    }

    // Delete the image from storage if it exists
    if (prize.imageStorageId) {
      await ctx.storage.delete(prize.imageStorageId);
    }

    await ctx.db.delete(args.prizeId);
  },
});

/**
 * Generate upload URL for prize image
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Get prize count
 */
export const getPrizeCount = query({
  args: {},
  handler: async (ctx) => {
    const prizes = await ctx.db.query("prizes").collect();
    return prizes.length;
  },
});

/**
 * List only available prizes (not yet won)
 */
export const listAvailablePrizes = query({
  args: {},
  handler: async (ctx) => {
    const prizes = await ctx.db
      .query("prizes")
      .withIndex("by_status", (q) => q.eq("status", "available"))
      .collect();
    return prizes.sort((a, b) => b._creationTime - a._creationTime);
  },
});

/**
 * Migration: Add status field to existing prizes
 * This should be run once to update existing prizes without a status field
 */
export const migrateAddStatusToPrizes = mutation({
  args: {},
  handler: async (ctx) => {
    const prizes = await ctx.db.query("prizes").collect();
    let updatedCount = 0;

    for (const prize of prizes) {
      // Check if prize already has a status field
      if (!prize.status) {
        await ctx.db.patch(prize._id, {
          status: "available",
        });
        updatedCount++;
      }
    }

    return {
      message: `Updated ${updatedCount} prizes with 'available' status`,
    };
  },
});
