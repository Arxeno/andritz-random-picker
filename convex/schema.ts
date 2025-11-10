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
    department: v.string(),
  }),

  // Winners table - stores confirmed winners with denormalized participant data
  winners: defineTable({
    participantId: v.id("participants"),
    participantName: v.string(), // Denormalized for easy export
    participantDepartment: v.string(), // Denormalized for easy export
    prizeId: v.optional(v.id("prizes")), // Optional prize assignment
    prizeName: v.optional(v.string()), // Denormalized prize name
    prizeImageStorageId: v.optional(v.id("_storage")), // Denormalized prize image
  }).index("by_participant", ["participantId"]),

  // Prizes table - stores prize information with images
  prizes: defineTable({
    name: v.string(),
    imageStorageId: v.optional(v.id("_storage")), // Convex file storage ID
  }),
});
