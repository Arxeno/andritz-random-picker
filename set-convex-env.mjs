import { config as loadEnvFile } from "dotenv";
import { spawnSync } from "child_process";
import fs from "fs";

/**
 * Set Convex environment variables from .env.local
 * This script reads JWT keys from .env.local and sets them in Convex deployment
 */

console.log("🔐 Setting Convex environment variables...\n");

// Load .env.local
if (!fs.existsSync(".env.local")) {
  console.error("❌ Error: .env.local file not found!");
  console.error("   Run 'pnpm generate:keys' first to generate JWT keys.\n");
  process.exit(1);
}

const config = {};
loadEnvFile({ path: ".env.local", processEnv: config, quiet: true });

// Check if JWT keys exist
if (!config.JWT_PRIVATE_KEY || !config.JWKS) {
  console.error("❌ Error: JWT keys not found in .env.local!");
  console.error("   Run 'pnpm generate:keys' to generate them.\n");
  process.exit(1);
}

console.log("✅ Found JWT keys in .env.local");
console.log("📤 Setting JWT_PRIVATE_KEY in Convex...");

// Set JWT_PRIVATE_KEY
const result1 = spawnSync(
  "npx",
  ["convex", "env", "set", "JWT_PRIVATE_KEY", config.JWT_PRIVATE_KEY],
  {
    stdio: "inherit",
    shell: true,
  }
);

if (result1.status !== 0) {
  console.error("\n❌ Failed to set JWT_PRIVATE_KEY");
  process.exit(1);
}

console.log("\n📤 Setting JWKS in Convex...");

// Set JWKS
const result2 = spawnSync(
  "npx",
  ["convex", "env", "set", "JWKS", config.JWKS],
  {
    stdio: "inherit",
    shell: true,
  }
);

if (result2.status !== 0) {
  console.error("\n❌ Failed to set JWKS");
  process.exit(1);
}

console.log("\n" + "=".repeat(70));
console.log("✅ SUCCESS! JWT keys set in Convex deployment");
console.log("=".repeat(70));
console.log("\n📋 Next steps:");
console.log("   1. Restart your dev server (Ctrl+C and run 'pnpm dev')");
console.log("   2. Try signing in again at http://localhost:3000/signin");
console.log("\n" + "=".repeat(70));

