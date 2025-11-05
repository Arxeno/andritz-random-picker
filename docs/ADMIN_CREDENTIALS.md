# Admin Credentials

## Default Admin Account

For the Doorprize Manager application, you need to create an admin account on first use.

### Initial Setup

1. Navigate to the signin page: `http://localhost:3000/signin`
2. Click "Sign In" (there is no sign-up link - this is intentional)
3. On first run, you'll need to create the admin account through the Convex Auth system

### Recommended Admin Credentials

**Email:** `admin@doorprize.local`  
**Password:** `DoorprizeAdmin2025!`

### Creating the Admin Account

Since Convex Auth requires user creation through the sign-up flow, but we've removed the sign-up UI:

**Option 1: Temporarily enable sign-up (Recommended for first-time setup)**
1. Temporarily add sign-up functionality to create the admin account
2. Create account with the credentials above
3. Remove sign-up functionality again

**Option 2: Use Convex Dashboard**
1. Go to your Convex dashboard
2. Navigate to the `users` table
3. Manually create a user record with the email above
4. The password will be hashed by Convex Auth on first login

**Option 3: Use the setup script**
1. Run the setup mutation from Convex dashboard:
   ```
   npx convex run setup:createAdminUser
   ```
2. This will log the credentials to the console

### Security Notes

⚠️ **IMPORTANT:** 
- These are default credentials for development/testing
- **Change the password immediately in production!**
- Never commit actual production credentials to version control
- Consider using environment variables for production credentials

### For Production

1. Create a strong, unique password
2. Store credentials securely (password manager, secure notes)
3. Do not share credentials via email or unsecured channels
4. Consider implementing password change functionality for production use

---

**Last Updated:** 2025-11-05  
**Story:** STORY-001 - Authentication System

