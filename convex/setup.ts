import { internalMutation, internalQuery } from "./_generated/server";

/**
 * IMPORTANT: Convex Auth does not provide a direct API to create users programmatically.
 * The Password provider requires going through the sign-up flow which hashes passwords
 * and creates all necessary auth tables (users, authAccounts, authSessions).
 *
 * This script can only CHECK if users exist and provide instructions.
 * To actually create the admin user, you MUST visit /setup-admin in your browser.
 */

/**
 * Setup script to check admin user status
 * Run with: npx convex run setup:createAdminUser
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
    // Check if any users exist
    const existingUsers = await ctx.db.query("users").collect();

    console.log("=".repeat(70));
    console.log("ADMIN USER SETUP");
    console.log("=".repeat(70));

    if (existingUsers.length > 0) {
      console.log("❌ Admin user already exists!");
      console.log(`   Found ${existingUsers.length} user(s) in the database.`);
      console.log("");
      console.log("Existing users:");
      existingUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.email || "N/A"}`);
      });
      console.log("");
      console.log("To sign in, go to: http://localhost:3000/signin");
      console.log("=".repeat(70));

      return {
        success: false,
        message: "Admin user already exists",
        userCount: existingUsers.length,
      };
    }

    // No users exist - provide setup instructions
    console.log("❌ No users found in database!");
    console.log("");
    console.log("⚠️  IMPORTANT:");
    console.log(
      "   This script CANNOT create users automatically because Convex Auth",
    );
    console.log(
      "   requires going through the sign-up flow to hash passwords properly.",
    );
    console.log("");
    console.log("📋 TO CREATE THE ADMIN USER:");
    console.log("   1. Open your browser and navigate to:");
    console.log("      http://localhost:3000/setup-admin");
    console.log("");
    console.log("   2. The form will be pre-filled with these credentials:");
    console.log("      Email:    admin@doorprize.local");
    console.log("      Password: DoorprizeAdmin2025!");
    console.log("");
    console.log("   3. Click 'Create Admin Account'");
    console.log("");
    console.log("   4. After creation, sign in at:");
    console.log("      http://localhost:3000/signin");
    console.log("");
    console.log("   5. Run 'pnpm setup:check' to verify user was created");
    console.log("");
    console.log(
      "⚠️  SECURITY: Change the password after first login in production!",
    );
    console.log("=".repeat(70));

    return {
      success: false,
      message:
        "No admin user exists. You MUST visit /setup-admin to create one manually.",
      setupUrl: "http://localhost:3000/setup-admin",
      credentials: {
        email: "admin@doorprize.local",
        password: "DoorprizeAdmin2025!",
      },
      note: "This script cannot create users automatically. Convex Auth requires the sign-up flow.",
    };
  },
});

/**
 * Check if admin user exists
 * Run with: npx convex run setup:checkAdminUser
 */
export const checkAdminUser = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const accounts = await ctx.db.query("authAccounts").collect();

    console.log("=".repeat(70));
    console.log("ADMIN USER STATUS");
    console.log("=".repeat(70));
    console.log(`Users in database: ${users.length}`);
    console.log(`Auth accounts: ${accounts.length}`);

    if (users.length > 0) {
      console.log("");
      console.log("Registered users:");
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email || "N/A"} (ID: ${user._id})`);
      });
    }
    console.log("=".repeat(70));

    return {
      userCount: users.length,
      accountCount: accounts.length,
      users: users.map((u) => ({ id: u._id, email: u.email })),
    };
  },
});
