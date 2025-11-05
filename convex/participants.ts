import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Add a single participant
 */
export const addParticipant = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (!args.fullName.trim()) {
      throw new Error("Full name is required");
    }
    if (!args.email.trim()) {
      throw new Error("Email is required");
    }
    if (!args.phone.trim()) {
      throw new Error("Phone number is required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Insert participant
    const participantId = await ctx.db.insert("participants", {
      fullName: args.fullName.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone.trim(),
    });

    return participantId;
  },
});

/**
 * List all participants
 */
export const listParticipants = query({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    
    // Sort alphabetically by name
    return participants.sort((a, b) => 
      a.fullName.localeCompare(b.fullName)
    );
  },
});

/**
 * Search participants by name, email, or phone
 */
export const searchParticipants = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const allParticipants = await ctx.db.query("participants").collect();
    
    if (!args.searchTerm.trim()) {
      return allParticipants.sort((a, b) => 
        a.fullName.localeCompare(b.fullName)
      );
    }

    const searchLower = args.searchTerm.toLowerCase();
    const filtered = allParticipants.filter(p => 
      p.fullName.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      p.phone.includes(searchLower)
    );

    return filtered.sort((a, b) => 
      a.fullName.localeCompare(b.fullName)
    );
  },
});

/**
 * Update a participant
 */
export const updateParticipant = mutation({
  args: {
    id: v.id("participants"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (!args.fullName.trim()) {
      throw new Error("Full name is required");
    }
    if (!args.email.trim()) {
      throw new Error("Email is required");
    }
    if (!args.phone.trim()) {
      throw new Error("Phone number is required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Update participant
    await ctx.db.patch(args.id, {
      fullName: args.fullName.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone.trim(),
    });

    return args.id;
  },
});

/**
 * Check if a participant is a winner
 */
export const checkIfWinner = query({
  args: {
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const winner = await ctx.db
      .query("winners")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .first();
    
    return winner !== null;
  },
});

/**
 * Delete a participant
 */
export const deleteParticipant = mutation({
  args: {
    id: v.id("participants"),
  },
  handler: async (ctx, args) => {
    // Check if participant is a winner
    const winner = await ctx.db
      .query("winners")
      .withIndex("by_participant", (q) => q.eq("participantId", args.id))
      .first();

    if (winner) {
      throw new Error("Cannot delete a participant who has already won a prize");
    }

    // Delete participant
    await ctx.db.delete(args.id);
    
    return args.id;
  },
});

/**
 * Bulk add participants from Excel import
 */
export const bulkAddParticipants = mutation({
  args: {
    participants: v.array(
      v.object({
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < args.participants.length; i++) {
      const participant = args.participants[i];
      
      try {
        // Validate
        if (!participant.fullName?.trim()) {
          throw new Error("Full name is required");
        }
        if (!participant.email?.trim()) {
          throw new Error("Email is required");
        }
        if (!participant.phone?.trim()) {
          throw new Error("Phone number is required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(participant.email)) {
          throw new Error("Invalid email format");
        }

        // Insert
        await ctx.db.insert("participants", {
          fullName: participant.fullName.trim(),
          email: participant.email.trim().toLowerCase(),
          phone: participant.phone.trim(),
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return results;
  },
});

/**
 * Get participant count
 */
export const getParticipantCount = query({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    return participants.length;
  },
});

/**
 * Delete all participants (for testing/reset)
 */
export const deleteAllParticipants = mutation({
  args: {},
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    
    for (const participant of participants) {
      // Check if participant is a winner
      const winner = await ctx.db
        .query("winners")
        .withIndex("by_participant", (q) => q.eq("participantId", participant._id))
        .first();

      if (!winner) {
        await ctx.db.delete(participant._id);
      }
    }

    return { deleted: participants.length };
  },
});

