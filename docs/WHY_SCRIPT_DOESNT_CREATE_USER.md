# Why the Setup Script Doesn't Create Users

## ❓ **The Question**

> "Why does `pnpm setup:admin` not create the user in the database?"

## 💡 **The Answer**

**The script CANNOT create users automatically.** This is a **Convex Auth limitation**, not a bug.

---

## 🔍 **Technical Explanation**

### **How Convex Auth Works**

Convex Auth's Password provider requires going through the **sign-up flow** to create users. This flow:

1. ✅ Hashes the password securely (using bcrypt or similar)
2. ✅ Creates a record in the `users` table
3. ✅ Creates a record in the `authAccounts` table (links user to password)
4. ✅ Creates a record in the `authSessions` table (logs user in)
5. ✅ Returns a session token

### **Why Can't We Do This in a Script?**

Convex Auth **does not expose** a public API to:

- Hash passwords programmatically
- Create auth accounts directly
- Bypass the sign-up flow

The **only way** to create a user is by calling:

```typescript
signIn("password", formData) // with flow: "signUp"
```

This function:

- ❌ Only works in the **frontend** (React components)
- ❌ Cannot be called from **backend** (Convex mutations/actions)
- ❌ Cannot be called from **CLI scripts**

---

## 🛠️ **What the Script Actually Does**

The `pnpm setup:admin` script:

✅ **Checks** if users exist in the database  
✅ **Provides** step-by-step instructions  
✅ **Shows** the credentials to use  
✅ **Guides** you to the `/setup-admin` page  

❌ **Does NOT** create the user automatically  
❌ **Does NOT** hash passwords  
❌ **Does NOT** insert database records  

---

## 📋 **How to Actually Create the Admin User**

### **Step 1: Run the Script (Optional)**

```bash
pnpm setup:admin
```

This will tell you what to do next.

### **Step 2: Visit the Setup Page (Required)**

```
http://localhost:3000/setup-admin
```

### **Step 3: Fill the Form**

The form will be pre-filled with:

- Email: `admin@doorprize.local`
- Password: `DoorprizeAdmin2025!`

### **Step 4: Click "Create Admin Account"**

This triggers the sign-up flow:

```typescript
// app/setup-admin/page.tsx
formData.set("flow", "signUp");
await signIn("password", formData);
```

### **Step 5: Verify Creation**

```bash
pnpm setup:check
```

Should show:

```
Users in database: 1
Auth accounts: 1

Registered users:
  1. admin@doorprize.local (ID: j97abc123def456)
```

---

## 🤔 **Why Not Just Insert into the Database?**

You might think: "Why not just insert a record into the `users` table?"

**This won't work because:**

1. **Password needs to be hashed**
   - Plain text passwords are insecure
   - Convex Auth uses bcrypt/scrypt internally
   - We don't have access to the hashing function

2. **Multiple tables need to be created**
   - `users` table (user account)
   - `authAccounts` table (password credential)
   - `authSessions` table (login session)
   - `authRefreshTokens` table (stay logged in)

3. **Convex Auth manages relationships**
   - User ID must match across tables
   - Account must link to user
   - Session must link to account
   - Convex Auth handles this automatically

---

## 🎯 **Alternative Solutions Considered**

### **Option 1: Manually Insert Records** ❌

```typescript
// This WON'T work!
await ctx.db.insert("users", {
  email: "admin@doorprize.local",
  // password: ??? How to hash it?
});
```

**Problem:** No access to password hashing function.

---

### **Option 2: Use Convex Actions to Call Frontend** ❌

```typescript
// This WON'T work!
export const createUser = internalAction({
  handler: async (ctx) => {
    // Can't call signIn() from backend
    await signIn("password", formData); // ERROR!
  },
});
```

**Problem:** `signIn()` only works in React components.

---

### **Option 3: Use HTTP API to Call Sign-Up Endpoint** ❌

```typescript
// This WON'T work!
export const createUser = internalAction({
  handler: async (ctx) => {
    await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
});
```

**Problem:** Convex Auth doesn't expose HTTP endpoints for sign-up.

---

### **Option 4: Visit /setup-admin Page** ✅

```
http://localhost:3000/setup-admin
```

**This works!** It uses the proper sign-up flow.

---

## 📝 **Summary**

| What | Can Do? | Why? |
|------|---------|------|
| Check if users exist | ✅ Yes | Can query database |
| Show instructions | ✅ Yes | Can print to console |
| Hash passwords | ❌ No | No access to hashing function |
| Create auth accounts | ❌ No | No public API |
| Trigger sign-up flow | ❌ No | Only works in frontend |
| **Visit /setup-admin** | ✅ **YES** | **Proper way to create users** |

---

## 🚀 **Quick Start**

**Just do this:**

1. Open browser
2. Go to: `http://localhost:3000/setup-admin`
3. Click "Create Admin Account"
4. Done! ✅

**Verify:**

```bash
pnpm setup:check
```

---

## 🔐 **Security Note**

This limitation is actually a **good thing** for security:

✅ Passwords are always hashed properly  
✅ No risk of storing plain text passwords  
✅ Consistent authentication flow  
✅ Convex Auth handles all security  

---

## 📚 **Related Documentation**

- [Admin Credentials Guide](./ADMIN_CREDENTIALS.md)
- [Convex Auth Docs](https://labs.convex.dev/auth)
- [Password Provider Docs](https://labs.convex.dev/auth/config/passwords)

---

**Last Updated:** 2025-11-05  
**Related Story:** STORY-001 - Authentication System
