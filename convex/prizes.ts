import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Add new prizes
 * Creates N separate prize records based on quantity
 */
export const addPrize = mutation({
  args: {
    name: v.string(),
    quantity: v.number(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.name.trim()) {
      throw new Error("Prize name is required");
    }

    if (args.quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    // Insert N separate prize records
    const prizeIds = [];
    for (let i = 0; i < args.quantity; i++) {
      const prizeId = await ctx.db.insert("prizes", {
        name: args.name.trim(),
        imageStorageId: args.imageStorageId,
        status: "available", // New prizes are always available
      });
      prizeIds.push(prizeId);
    }

    return prizeIds;
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
 * List prizes grouped by name
 * Returns unique prize types with their counts
 */
export const listGroupedPrizes = query({
  args: {},
  handler: async (ctx) => {
    const prizes = await ctx.db.query("prizes").collect();

    // Group prizes by name
    const grouped = new Map<
      string,
      {
        name: string;
        imageStorageId?: Id<"_storage">;
        totalCount: number;
        availableCount: number;
        wonCount: number;
        prizeIds: Id<"prizes">[];
      }
    >();

    for (const prize of prizes) {
      const existing = grouped.get(prize.name);
      if (existing) {
        existing.totalCount++;
        existing.prizeIds.push(prize._id);
        if (prize.status === "available") {
          existing.availableCount++;
        } else {
          existing.wonCount++;
        }
      } else {
        grouped.set(prize.name, {
          name: prize.name,
          imageStorageId: prize.imageStorageId,
          totalCount: 1,
          availableCount: prize.status === "available" ? 1 : 0,
          wonCount: prize.status === "won" ? 1 : 0,
          prizeIds: [prize._id],
        });
      }
    }

    return Array.from(grouped.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
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
 * Update all prizes with the same name
 * Updates name and image for all prize instances that match the old name
 */
export const updatePrize = mutation({
  args: {
    oldName: v.string(),
    newName: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (!args.newName.trim()) {
      throw new Error("Prize name is required");
    }

    // Find all prizes with the old name
    const prizes = await ctx.db
      .query("prizes")
      .filter((q) => q.eq(q.field("name"), args.oldName))
      .collect();

    if (prizes.length === 0) {
      throw new Error("No prizes found with that name");
    }

    // Delete old images if a new one is provided
    if (args.imageStorageId) {
      const oldImageIds = new Set(
        prizes
          .map((p) => p.imageStorageId)
          .filter((id): id is Id<"_storage"> => id !== undefined),
      );

      for (const oldImageId of oldImageIds) {
        if (oldImageId && oldImageId !== args.imageStorageId) {
          await ctx.storage.delete(oldImageId);
        }
      }
    }

    // Update all matching prizes
    for (const prize of prizes) {
      await ctx.db.patch(prize._id, {
        name: args.newName.trim(),
        imageStorageId: args.imageStorageId ?? prize.imageStorageId,
      });
    }

    return prizes.length;
  },
});

/**
 * Delete a single prize instance
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
 * Delete all prizes with a given name
 */
export const deletePrizesByName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Find all prizes with this name
    const prizes = await ctx.db
      .query("prizes")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect();

    if (prizes.length === 0) {
      throw new Error("No prizes found with that name");
    }

    // Collect unique image IDs to delete
    const imageIds = new Set(
      prizes
        .map((p) => p.imageStorageId)
        .filter((id): id is Id<"_storage"> => id !== undefined),
    );

    // Delete all prize records
    for (const prize of prizes) {
      await ctx.db.delete(prize._id);
    }

    // Delete images
    for (const imageId of imageIds) {
      await ctx.storage.delete(imageId);
    }

    return prizes.length;
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
