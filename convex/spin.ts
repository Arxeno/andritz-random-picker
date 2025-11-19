import { query } from "./_generated/server";

/**
 * Get all eligible participants for the wheel spin
 * Returns participants who have NOT won a prize yet
 */
export const getEligibleParticipants = query({
  args: {},
  handler: async (ctx) => {
    // Get all participants
    const participants = await ctx.db.query("participants").collect();

    // Get all winners to exclude them
    const winners = await ctx.db.query("winners").collect();
    const winnerParticipantIds = new Set(
      winners.map((winner) => winner.participantId),
    );

    // Filter out participants who have already won
    const eligibleParticipants = participants.filter(
      (participant) => !winnerParticipantIds.has(participant._id),
    );

    // Sort alphabetically for consistent wheel display
    return eligibleParticipants.sort((a, b) =>
      a.fullName.localeCompare(b.fullName),
    );
  },
});

/**
 * Get eligible participant count for display
 * Returns count of participants who have NOT won a prize yet
 */
export const getParticipantCount = query({
  args: {},
  handler: async (ctx) => {
    // Get all participants
    const participants = await ctx.db.query("participants").collect();

    // Get all winners to exclude them
    const winners = await ctx.db.query("winners").collect();
    const winnerParticipantIds = new Set(
      winners.map((winner) => winner.participantId),
    );

    // Count only eligible participants (those who haven't won)
    const eligibleCount = participants.filter(
      (participant) => !winnerParticipantIds.has(participant._id),
    ).length;

    return eligibleCount;
  },
});
