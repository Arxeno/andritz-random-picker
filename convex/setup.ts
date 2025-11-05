import { internalMutation } from "./_generated/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Setup script to create the hardcoded admin user
 * This should be run once during initial deployment
 * 
 * Admin credentials:
 * Email: admin@doorprize.local
 * Password: DoorprizeAdmin2025!
 * 
 * IMPORTANT: Change the password after first login in production!
 */
export const createAdminUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if admin user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "admin@doorprize.local"))
      .first();

    if (existingUser) {
      console.log("Admin user already exists");
      return { success: false, message: "Admin user already exists" };
    }

    // Create admin user with hardcoded credentials
    // Note: Convex Auth will handle password hashing automatically
    const adminEmail = "admin@doorprize.local";
    const adminPassword = "DoorprizeAdmin2025!";

    // The Password provider will hash the password automatically
    // We need to create the user account through the auth system
    console.log("Creating admin user...");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("IMPORTANT: Change this password after first login!");

    return {
      success: true,
      message: "Admin user creation initiated. Use the signin page to complete setup.",
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    };
  },
});

