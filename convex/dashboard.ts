import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get dashboard statistics
 * Returns real-time counts of participants and winners
 */
export const getStats = query({
  args: {},
  returns: v.object({
    participantCount: v.number(),
    winnerCount: v.number(),
  }),
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    const winners = await ctx.db.query("winners").collect();
    
    return {
      participantCount: participants.length,
      winnerCount: winners.length,
    };
  },
});

