# User Story #006: Save Winners to Database

**Story ID:** STORY-006  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #4 - Save Winners to Database  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 3  
**Phase:** Phase 1 - Core MVP

---

## 📖 User Story

**As an** event administrator  
**I want** winners automatically saved to the database after confirmation  
**So that** I have a permanent, auditable record of all prize winners

---

## 🎯 Business Value

- **Accountability:** Permanent record prevents disputes about who won
- **Audit Trail:** Timestamp proves when each winner was selected
- **Data Integrity:** Immutable records ensure data cannot be tampered with
- **Reporting:** Saved data enables winner history and export features

---

## 📋 Acceptance Criteria

### AC1: Confirm Winner Button
- ✅ "Confirm Winner" button visible after wheel stops
- ✅ Button clearly labeled: "Confirm Winner" or "Save Winner"
- ✅ Button positioned next to "Re-spin" button
- ✅ Button enabled when winner is selected (pending state)

### AC2: Save to Database
- ✅ Clicking "Confirm Winner" saves winner to `winners` table
- ✅ Saved data includes:
  - participantId (reference to participant record)
  - participantName (denormalized - full name)
  - participantEmail (denormalized)
  - participantPhone (denormalized)
  - timestamp (automatic - when confirmed)
- ✅ Save happens immediately (no delay)
- ✅ Convex mutation handles database write

### AC3: Data Persistence
- ✅ Winner data persists across sessions
- ✅ Winner data survives browser refresh
- ✅ Winner data cannot be deleted (immutable audit trail)
- ✅ Timestamp accurate to the second

### AC4: Post-Confirmation State
- ✅ After save, show success message: "Winner confirmed! 🎉"
- ✅ Disable "Confirm Winner" button (already confirmed)
- ✅ Disable "Re-spin" button (cannot re-spin after confirmation)
- ✅ Show option to:
  - "Spin for Next Prize" (reset to idle state)
  - "Back to Menu" (navigate to main menu)
  - "View Winner History" (navigate to `/winners`)

### AC5: Error Handling
- ✅ If save fails, show error message
- ✅ Error message: "Failed to save winner. Please try again."
- ✅ Keep winner in pending state (allow retry)
- ✅ Log error to console for debugging

### AC6: Real-time Updates
- ✅ Dashboard stats update immediately after save
- ✅ Winner count increments by 1
- ✅ Winner appears in winner history immediately (if viewing)

---

## 🎨 User Experience

### Confirmation Flow:
```
1. Wheel stops on Alice
   Status: "Winner pending confirmation"
   Buttons: [Re-spin] [Confirm Winner]

2. Click "Confirm Winner"
   → Saving to database...
   → Success!

3. Status: "Winner confirmed! 🎉"
   Buttons: [Spin for Next Prize] [Back to Menu] [View History]
   
   "Re-spin" and "Confirm Winner" buttons disabled/hidden
```

### Visual Feedback:
```
┌─────────────────────────────────────────────┐
│ Spin the Wheel                              │
│                                             │
│ ✅ Winner confirmed!                        │
│                                             │
│ 🎉 Alice Johnson                            │
│ Email: alice@example.com                    │
│ Phone: (555) 123-4567                       │
│ Confirmed at: 2:45 PM                       │
│                                             │
│ [Spin for Next Prize] [Back to Menu]       │
│ [View Winner History]                       │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technical Notes

### Convex Mutation:
```typescript
// convex/winners.ts
export const confirmWinner = mutation({
  args: {
    participantId: v.id("participants"),
  },
  returns: v.id("winners"),
  handler: async (ctx, args) => {
    // Get participant details
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }
    
    // Save winner (denormalized for easy export)
    const winnerId = await ctx.db.insert("winners", {
      participantId: args.participantId,
      participantName: participant.fullName,
      participantEmail: participant.email,
      participantPhone: participant.phone,
      // timestamp added automatically by Convex (_creationTime)
    });
    
    return winnerId;
  },
});
```

### Why Denormalize?
- **Export Efficiency:** Winner history and XLSX export don't need joins
- **Data Integrity:** Winner record preserved even if participant edited/deleted
- **Performance:** Faster queries for winner history and export

### State Management:
```typescript
const [confirmState, setConfirmState] = useState<'idle' | 'saving' | 'confirmed' | 'error'>('idle');

const handleConfirm = async () => {
  setConfirmState('saving');
  try {
    await confirmWinnerMutation({ participantId: currentWinner.id });
    setConfirmState('confirmed');
    // Update UI, show success message
  } catch (error) {
    setConfirmState('error');
    // Show error message
  }
};
```

---

## 📦 Dependencies

### Required Before:
- ✅ STORY-002 (Main Menu) - Database schema created
- ✅ STORY-004 (Spin the Wheel) - Confirm button created there
- ✅ STORY-005 (Re-spin) - Pending state management

### Blocks:
- STORY-007 (Winner History) - Needs saved winners to display
- STORY-008 (Export Data) - Needs saved winners to export

### Related:
- Completes the spin workflow (STORY-004 → STORY-005 → STORY-006)

---

## 🧪 Testing Scenarios

### Happy Path:
1. Spin wheel → Winner selected
2. Click "Confirm Winner"
3. Success message shown
4. Winner saved to database
5. Dashboard stats update (+1 winner)
6. "Spin for Next Prize" button appears

### Error Cases:
1. Database connection lost → Show error, allow retry
2. Invalid participant ID → Show error (shouldn't happen)
3. Rapid clicking "Confirm" → Only save once (idempotent)

### Data Verification:
1. Check database → Winner record exists
2. Check timestamp → Accurate to current time
3. Check denormalized data → Matches participant data
4. Refresh page → Winner still in database

### Integration:
1. Confirm winner → Navigate to winner history → Winner appears
2. Confirm winner → Dashboard stats update immediately
3. Confirm 5 winners → All 5 in database

---

## 📝 Notes

- **Immutability:** Winners cannot be deleted (audit integrity)
- **Denormalization:** Trade-off for performance and data integrity
- **Timestamp:** Use Convex `_creationTime` system field
- **Future:** Could add "prize name" field if prize management added later

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Confirm button saves winner to database
- ✅ All required fields saved correctly
- ✅ Timestamp accurate
- ✅ Success message shown
- ✅ Post-confirmation state correct
- ✅ Dashboard stats update in real-time
- ✅ Error handling works
- ✅ No TypeScript or ESLint errors
- ✅ Tested with 10+ winner confirmations

---

**Related PRD Section:** Section 4.4 - Feature #4: Save Winners to Database  
**Related Epic Section:** Phase 1 - Core MVP

