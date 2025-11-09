import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get URL for a file stored in Convex storage
 */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

