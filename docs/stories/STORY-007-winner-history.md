# User Story #007: Winner History View

**Story ID:** STORY-007  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #8 - Winner History View  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 5  
**Phase:** Phase 3 - Enhanced UX

---

## 📖 User Story

**As an** event administrator  
**I want** to view all past winners in chronological order  
**So that** I can review results, verify fairness, and answer questions about who won

---

## 🎯 Business Value

- **Transparency:** Complete record of all winners builds trust
- **Verification:** Admin can confirm all prizes were awarded correctly
- **Dispute Resolution:** Historical record resolves questions about winners
- **Reporting:** Provides data for post-event communication with family

---

## 📋 Acceptance Criteria

### AC1: Page Structure
- ✅ Accessible at `/winners` route
- ✅ Protected route (requires authentication)
- ✅ Clear page title: "Winner History"
- ✅ Responsive design for tablet and desktop

### AC2: Winner List Display
- ✅ Table showing all confirmed winners with columns:
  - Winner Name
  - Email
  - Phone Number
  - Date/Time Won (formatted: "Nov 5, 2025 at 2:45 PM")
- ✅ Sorted chronologically (most recent first)
- ✅ Real-time updates (Convex reactive query)
- ✅ Show total count: "X winners"

### AC3: Empty State
- ✅ If no winners yet, show message:
  - "No winners yet. Start spinning to select your first winner!"
- ✅ Include button: "Go to Spin Wheel" → Navigate to `/spin`

### AC4: Search and Filter
- ✅ Search box above table
- ✅ Search filters by name, email, or phone (case-insensitive)
- ✅ Results update as user types (debounced)
- ✅ Show filtered count: "Showing X of Y winners"
- ✅ Date range filter (optional - nice to have, not required for MVP)

### AC5: Read-Only View
- ✅ No edit or delete buttons (immutable audit trail)
- ✅ Clear indication this is view-only: "Winner records cannot be modified"
- ✅ No actions column in table

### AC6: Performance
- ✅ Page loads quickly even with 100+ winners
- ✅ Smooth scrolling for long lists
- ✅ Consider pagination if > 50 winners (optional for MVP)

### AC7: Navigation
- ✅ "Back to Menu" button/link
- ✅ "Export to Excel" button → Navigate to `/export` or trigger export
- ✅ Header with app title and sign out (consistent with other pages)

---

## 🎨 User Experience

### Page Layout:
```
┌─────────────────────────────────────────────┐
│ Doorprize Manager          [Sign Out]       │
├─────────────────────────────────────────────┤
│ ← Back to Menu                              │
│                                             │
│ Winner History                              │
│ 🏆 8 winners                                │
│                                             │
│ Search: [____________]  [Export to Excel]   │
│                                             │
│ ⓘ Winner records cannot be modified        │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Name    │ Email   │ Phone │ Date/Time  ││ │
│ ├─────────────────────────────────────────┤ │
│ │ Carol   │ c@e.com │ 555.. │ Nov 5 2:45 ││ │
│ │ Bob     │ b@e.com │ 555.. │ Nov 5 2:30 ││ │
│ │ Alice   │ a@e.com │ 555.. │ Nov 5 2:15 ││ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Empty State:
```
┌─────────────────────────────────────────────┐
│ Winner History                              │
│                                             │
│         🎡                                  │
│                                             │
│   No winners yet.                           │
│   Start spinning to select your first       │
│   winner!                                   │
│                                             │
│   [  Go to Spin Wheel  ]                   │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technical Notes

### Convex Query:
```typescript
// convex/winners.ts
export const listWinners = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("winners"),
    participantName: v.string(),
    participantEmail: v.string(),
    participantPhone: v.string(),
    _creationTime: v.number(),
  })),
  handler: async (ctx) => {
    const winners = await ctx.db
      .query("winners")
      .order("desc") // Most recent first
      .collect();
    return winners;
  },
});
```

### Search Implementation:
```typescript
// Client-side filtering (simple approach for MVP)
const filteredWinners = winners.filter(winner => 
  winner.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  winner.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
  winner.participantPhone.includes(searchTerm)
);

// Or server-side with Convex search index (better for large datasets)
```

### Date Formatting:
```typescript
// Use Intl.DateTimeFormat for locale-aware formatting
const formatTimestamp = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
};
```

---

## 📦 Dependencies

### Required Before:
- ✅ STORY-002 (Main Menu) - Navigation link exists
- ✅ STORY-006 (Save Winners) - Need winners to display

### Blocks:
- STORY-008 (Export Data) - Export button links to export page

### Related:
- Displays data saved by STORY-006
- Provides data for STORY-008 export

---

## 🧪 Testing Scenarios

### Happy Path:
1. Navigate to `/winners`
2. See list of all winners (if any exist)
3. Winners sorted newest first
4. All data displayed correctly
5. Search for "Alice" → Only Alice shown
6. Clear search → All winners shown again

### Empty State:
1. No winners in database → Show empty state message
2. Click "Go to Spin Wheel" → Navigate to `/spin`

### Search:
1. Search by name → Correct results
2. Search by email → Correct results
3. Search by phone → Correct results
4. Search with no matches → Show "No results found"
5. Clear search → All winners return

### Performance:
1. Load page with 100 winners → Loads in < 2 seconds
2. Scroll through long list → Smooth scrolling
3. Search with 100 winners → Results update quickly

### Real-time:
1. Open winner history in one tab
2. Confirm new winner in another tab
3. Winner history updates automatically (Convex reactivity)

---

## 📝 Notes

- **Read-Only:** Emphasize this is an audit trail, not editable
- **Sorting:** Most recent first makes sense for event flow
- **Search:** Client-side filtering is fine for MVP (< 100 winners)
- **Future:** Could add filters by date range, export selected winners, etc.

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Winner list displays correctly
- ✅ Sorted chronologically (newest first)
- ✅ Search functionality works
- ✅ Empty state handled gracefully
- ✅ Read-only (no edit/delete)
- ✅ Real-time updates work
- ✅ Performance good with 100+ winners
- ✅ No TypeScript or ESLint errors
- ✅ Tested with 0, 1, 10, and 100 winners

---

**Related PRD Section:** Section 4.8 - Feature #8: Winner History View  
**Related Epic Section:** Phase 3 - Enhanced UX

