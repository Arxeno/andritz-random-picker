# User Story #002: Main Menu & Dashboard

**Story ID:** STORY-002  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #2 - Main Menu Page  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 3  
**Phase:** Phase 1 - Core MVP

---

## 📖 User Story

**As an** event administrator  
**I want** a central navigation hub with quick stats  
**So that** I can easily access all doorprize features and monitor event status at a glance

---

## 🎯 Business Value

- **Efficiency:** Single dashboard for all event management tasks
- **Visibility:** Real-time stats show event progress (participants enrolled, winners selected)
- **Usability:** Clear navigation reduces learning curve for non-technical users
- **Confidence:** At-a-glance metrics confirm system is working correctly

---

## 📋 Acceptance Criteria

### AC1: Page Structure
- ✅ Accessible at `/` route (root/home page)
- ✅ Protected route (requires authentication)
- ✅ Responsive design for tablet (768px+) and desktop (1024px+)
- ✅ Clean, professional layout using Tailwind CSS

### AC2: Header
- ✅ Sticky header at top of page
- ✅ App title: "Doorprize Manager" or similar
- ✅ "Sign Out" button in header
- ✅ Header visible on all pages (consistent navigation)

### AC3: Dashboard Stats
- ✅ Display 2 stat cards prominently:
  - **Total Participants:** Count of all participants in database
  - **Total Winners:** Count of all confirmed winners
- ✅ Stats update in real-time (Convex reactive queries)
- ✅ Show "0" when no data exists (not blank or error)
- ✅ Loading state while fetching data
- ✅ Large, readable numbers with labels

### AC4: Navigation Menu
- ✅ Display 4 navigation cards/buttons:
  1. **Manage Participants** → `/participants`
  2. **Spin the Wheel** → `/spin`
  3. **Winner History** → `/winners`
  4. **Export Data** → `/export`
- ✅ Each card shows:
  - Icon (emoji or simple SVG)
  - Title (feature name)
  - Brief description (1 sentence explaining purpose)
- ✅ Cards are clickable (use Next.js Link)
- ✅ Hover state provides visual feedback
- ✅ Grid layout (2x2 on tablet, 4 columns on desktop)

### AC5: Database Schema
- ✅ `participants` table created with fields:
  - fullName (string)
  - email (string)
  - phone (string)
  - createdAt (timestamp - automatic)
- ✅ `winners` table created with fields:
  - participantId (reference to participants)
  - participantName (string - denormalized for export)
  - participantEmail (string - denormalized)
  - participantPhone (string - denormalized)
  - timestamp (timestamp - automatic)
- ✅ Appropriate indexes for queries

---

## 🎨 User Experience

### Visual Hierarchy:
```
┌─────────────────────────────────────────┐
│ Doorprize Manager          [Sign Out]   │ ← Header
├─────────────────────────────────────────┤
│                                         │
│  📊 Dashboard Stats                     │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ Participants │  │   Winners    │    │
│  │      42      │  │      8       │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  🎯 Quick Actions                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ 👥      │ │ 🎡      │ │ 🏆      │  │
│  │Manage   │ │ Spin    │ │ Winner  │  │
│  │Particip.│ │the Wheel│ │ History │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐                           │
│  │ 📥      │                           │
│  │ Export  │                           │
│  │  Data   │                           │
│  └─────────┘                           │
└─────────────────────────────────────────┘
```

### Navigation Card Descriptions:
- **Manage Participants:** "Add, import, and manage event participants"
- **Spin the Wheel:** "Select winners with interactive spinning wheel"
- **Winner History:** "View all confirmed winners from this event"
- **Export Data:** "Download winner list as Excel spreadsheet"

---

## 🛠️ Technical Notes

### Current State:
- Template has demo "numbers" app at `/`
- Need to completely replace with doorprize dashboard

### Required Changes:
1. **Replace `app/page.tsx`** - Remove demo content, add dashboard
2. **Update `convex/schema.ts`** - Add participants and winners tables
3. **Create `convex/dashboard.ts`** - Queries for stats
4. **Remove `convex/myFunctions.ts`** - No longer needed

### Convex Queries Needed:
```typescript
// convex/dashboard.ts
export const getStats = query({
  args: {},
  returns: v.object({
    participantCount: v.number(),
    winnerCount: v.number(),
  }),
  handler: async (ctx) => {
    const participants = await ctx.db.query("participants").collect();
    const winners = await ctx.db.query("winners").collect();
    return {
      participantCount: participants.length,
      winnerCount: winners.length,
    };
  },
});
```

---

## 📦 Dependencies

### Required Before:
- ✅ STORY-001 (Authentication) - Must be logged in to access

### Blocks:
- STORY-003 (Participant Management) - Navigation link created here
- STORY-004 (Spin the Wheel) - Navigation link created here
- STORY-007 (Winner History) - Navigation link created here
- STORY-008 (Export Data) - Navigation link created here

### Note:
Navigation links can point to non-existent pages initially. They'll be implemented in subsequent stories.

---

## 🧪 Testing Scenarios

### Happy Path:
1. Log in as admin
2. Redirected to main menu (`/`)
3. See dashboard with stats showing "0" (no data yet)
4. See 4 navigation cards
5. Click each card - navigate to respective route
6. Stats update when data added (test after STORY-003)

### Edge Cases:
1. No participants → Show "0" participants
2. No winners → Show "0" winners
3. Large numbers (100+) → Display correctly
4. Slow network → Show loading state

### Responsive:
1. Tablet (768px) → 2x2 grid for navigation
2. Desktop (1024px+) → 4 columns for navigation
3. Stats always side-by-side

---

## 📝 Notes

- **Foundation:** This story establishes the database schema used by all other features
- **Navigation:** Links to pages that don't exist yet is OK - they'll be built in later stories
- **Real-time:** Convex queries are reactive - stats auto-update when data changes
- **Design:** Keep it simple and clean - family event admins need clarity, not complexity

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Dashboard displays correct stats
- ✅ All navigation links work (even if destination pages are placeholders)
- ✅ Database schema created and deployed
- ✅ Responsive design works on tablet and desktop
- ✅ No TypeScript or ESLint errors
- ✅ Demo content completely removed

---

**Related PRD Section:** Section 4.2 - Feature #2: Main Menu Page  
**Related Epic Section:** Phase 1 - Core MVP

