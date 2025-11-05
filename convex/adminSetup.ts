import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check if any users exist in the system
 * This helps determine if we need to create the initial admin user
 */
export const hasUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").first();
    return users !== null;
  },
});

/**
 * One-time admin account creation
 * This mutation allows creating the first admin account
 * It will only work if no users exist in the system
 * 
 * Default credentials:
 * Email: admin@doorprize.local
 * Password: DoorprizeAdmin2025!
 */
export const createInitialAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if any users already exist
    const existingUser = await ctx.db.query("users").first();
    
    if (existingUser) {
      throw new Error("Admin user already exists. Use the signin page to log in.");
    }

    // Note: We can't directly create a user with a hashed password here
    // because Convex Auth handles password hashing internally
    // This function serves as documentation and validation
    
    console.log("=".repeat(60));
    console.log("ADMIN ACCOUNT SETUP");
    console.log("=".repeat(60));
    console.log("To create the admin account, you need to:");
    console.log("1. Temporarily enable sign-up in app/signin/page.tsx");
    console.log("2. Sign up with these credentials:");
    console.log(`   Email: ${args.email}`);
    console.log(`   Password: ${args.password}`);
    console.log("3. Remove sign-up functionality again");
    console.log("=".repeat(60));
    
    return {
      success: false,
      message: "Please follow the manual setup instructions above",
      email: args.email,
    };
  },
});

