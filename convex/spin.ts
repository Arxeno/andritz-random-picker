import { query } from "./_generated/server";

/**
 * Get all eligible participants for the wheel spin
 * Returns all participants from the database
 */
export const getEligibleParticipants = query({
  args: {},
  handler: async (ctx) => {
    // Get all participants sorted alphabetically by name
    const participants = await ctx.db
      .query("participants")
      .collect();

    // Sort alphabetically for consistent wheel display
    return participants.sort((a, b) => a.fullName.localeCompare(b.fullName));
  },
});

/**
 * Get participant count for display
 */
export const getParticipantCount = query({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    return participants.length;
  },
});

