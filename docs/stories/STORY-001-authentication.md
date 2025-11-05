# User Story #001: Authentication System

**Story ID:** STORY-001  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #1 - Login Page  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 2  
**Phase:** Phase 1 - Core MVP

---

## 📖 User Story

**As an** event administrator  
**I want** to securely log in with a hardcoded admin account  
**So that** only I can access and manage the doorprize event

---

## 🎯 Business Value

- **Security:** Prevents unauthorized access to event management
- **Simplicity:** No user management overhead for single-admin family events
- **Reliability:** Hardcoded credentials eliminate account creation/recovery complexity

---

## 📋 Acceptance Criteria

### AC1: Hardcoded Admin Credentials
- ✅ System has single hardcoded admin user (email + password)
- ✅ Credentials stored securely (not in client-side code)
- ✅ No ability to create additional users
- ✅ No password reset functionality needed

### AC2: Login Page
- ✅ Accessible at `/signin` route
- ✅ Simple form with email and password fields
- ✅ "Sign In" button to submit credentials
- ✅ Clean, professional design using Tailwind CSS

### AC3: Authentication Flow
- ✅ Correct credentials grant access to main menu (`/`)
- ✅ Invalid credentials show clear error message
- ✅ Error message doesn't reveal whether email or password is wrong (security)
- ✅ Session persists across page refreshes
- ✅ Session persists across browser restarts (remember me)

### AC4: Protected Routes
- ✅ All routes except `/signin` require authentication
- ✅ Unauthenticated users redirected to `/signin`
- ✅ After successful login, redirect to `/` (main menu)

### AC5: Logout Functionality
- ✅ "Sign Out" button visible on all authenticated pages
- ✅ Sign out clears session completely
- ✅ After sign out, redirect to `/signin`
- ✅ Cannot access protected routes after sign out

---

## 🔧 Current State vs Required State

### Current (Template Implementation):
- ✅ Convex Auth with Password provider configured
- ✅ Sign in page at `/signin` with email/password form
- ✅ Sign up functionality (allows creating new users)
- ✅ Middleware protecting routes
- ✅ Sign out button on main page

### Required Changes:
- 🔄 **Remove sign-up functionality** - No "Sign up instead" link
- 🔄 **Create hardcoded admin user** - Pre-seed database or use Convex auth config
- 🔄 **Disable user registration** - Only hardcoded admin can authenticate
- 🔄 **Update UI messaging** - "Admin Login" instead of generic "Log in to see the numbers"
- 🔄 **Simplify error handling** - Generic "Invalid credentials" message

---

## 🛠️ Technical Notes

### Hardcoded Credentials Approach:
**Option A:** Pre-seed admin user in Convex database
- Create migration/setup script
- Insert admin user with hashed password
- Run once during initial deployment

**Option B:** Use Convex auth configuration
- Configure in `convex/auth.config.ts`
- Validate against hardcoded values in auth handler

**Recommended:** Option A (pre-seed database) - more standard Convex Auth pattern

### Files to Modify:
- `app/signin/page.tsx` - Remove sign-up toggle, update messaging
- `convex/auth.ts` - Potentially add validation logic
- Create `convex/setup.ts` - Script to create admin user (run once)
- `middleware.ts` - Already configured correctly

---

## 📦 Dependencies

### Required Before:
- ✅ Convex Auth configured (DONE)
- ✅ Next.js middleware set up (DONE)

### Blocks:
- STORY-002 (Main Menu) - Cannot access without authentication

---

## 🧪 Testing Scenarios

### Happy Path:
1. Navigate to `/signin`
2. Enter correct admin email and password
3. Click "Sign In"
4. Redirected to `/` (main menu)
5. Session persists on page refresh

### Error Cases:
1. Wrong email → Show "Invalid credentials"
2. Wrong password → Show "Invalid credentials"
3. Empty fields → Show validation error
4. Try to access `/` without login → Redirect to `/signin`

### Sign Out:
1. Click "Sign Out" button
2. Session cleared
3. Redirected to `/signin`
4. Cannot access `/` without logging in again

---

## 📝 Notes

- **Security:** Don't expose whether email or password is incorrect
- **UX:** Keep it simple - family event admins aren't tech experts
- **Future:** If multi-admin needed, can extend later (not in MVP)
- **Credentials:** Document admin email/password in secure location (not in code)

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Sign-up functionality removed
- ✅ Hardcoded admin user created
- ✅ Login/logout flow works correctly
- ✅ Protected routes enforce authentication
- ✅ No TypeScript or ESLint errors
- ✅ Tested on Chrome, Firefox, Safari

---

**Related PRD Section:** Section 4.1 - Feature #1: Login Page  
**Related Epic Section:** Phase 1 - Core MVP

