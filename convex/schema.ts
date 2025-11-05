import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // Participants table - stores all event participants
  participants: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
  }).index("by_email", ["email"]),

  // Winners table - stores confirmed winners with denormalized participant data
  winners: defineTable({
    participantId: v.id("participants"),
    participantName: v.string(), // Denormalized for easy export
    participantEmail: v.string(), // Denormalized for easy export
    participantPhone: v.string(), // Denormalized for easy export
  }).index("by_participant", ["participantId"]),
});
