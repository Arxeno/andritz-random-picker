# User Story #004: Spin the Wheel

**Story ID:** STORY-004  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #3 - Spin the Wheel Page  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 8  
**Phase:** Phase 1 - Core MVP

---

## 📖 User Story

**As an** event administrator  
**I want** to spin an interactive wheel to select winners  
**So that** the prize selection process is fair, transparent, and engaging for attendees

---

## 🎯 Business Value

- **Fairness:** Truly random selection ensures equal opportunity for all participants
- **Engagement:** Visual spinning animation creates excitement and anticipation
- **Transparency:** Everyone can see the selection process is unbiased
- **Trust:** Random algorithm eliminates favoritism concerns

---

## 📋 Acceptance Criteria

### AC1: Page Structure
- ✅ Accessible at `/spin` route
- ✅ Protected route (requires authentication)
- ✅ Full-screen or prominent wheel display
- ✅ Clear page title: "Spin the Wheel"

### AC2: Spinning Wheel Visual
- ✅ Circular wheel displaying all participant names
- ✅ Wheel divided into equal segments (one per participant)
- ✅ Each segment shows participant name (truncated if too long)
- ✅ Distinct colors for each segment (or alternating colors)
- ✅ Pointer/indicator at top showing selected segment
- ✅ Smooth, realistic spinning animation

### AC3: Spin Functionality
- ✅ "Spin" button prominently displayed
- ✅ Button disabled while wheel is spinning
- ✅ Wheel spins for 3-5 seconds (configurable)
- ✅ Wheel decelerates naturally (easing animation)
- ✅ Wheel stops on random participant
- ✅ Selection is cryptographically random (not predictable)

### AC4: Winner Display
- ✅ After wheel stops, highlight selected segment
- ✅ Display winner name prominently (large text)
- ✅ Show winner details: Full Name, Email, Phone
- ✅ Celebration effect (confetti, animation, or visual feedback)
- ✅ Clear visual distinction between "spinning" and "winner selected" states

### AC5: Pre-Spin Validation
- ✅ If no participants exist, show message: "No participants yet. Add participants first."
- ✅ Disable "Spin" button if no participants
- ✅ Show participant count: "X participants in the draw"

### AC6: Post-Spin Actions
- ✅ After winner selected, show 2 buttons:
  - "Re-spin" - Spin again (see STORY-005)
  - "Confirm Winner" - Save winner to database (see STORY-006)
- ✅ Both buttons clearly visible and labeled
- ✅ Winner not saved until "Confirm Winner" clicked

---

## 🎨 User Experience

### Page Layout:
```
┌─────────────────────────────────────────────┐
│ Doorprize Manager          [Sign Out]       │
├─────────────────────────────────────────────┤
│ ← Back to Menu                              │
│                                             │
│ Spin the Wheel                              │
│ 42 participants in the draw                 │
│                                             │
│           ┌─────────────┐                   │
│           │      ▼      │                   │
│           │             │                   │
│           │   ┌─────┐   │                   │
│           │  ╱       ╲  │                   │
│           │ │  WHEEL  │ │                   │
│           │  ╲       ╱  │                   │
│           │   └─────┘   │                   │
│           └─────────────┘                   │
│                                             │
│         [     SPIN     ]                    │
│                                             │
│ (After spin:)                               │
│ 🎉 Winner: Alice Johnson                    │
│ Email: alice@example.com                    │
│ Phone: (555) 123-4567                       │
│                                             │
│ [  Re-spin  ] [  Confirm Winner  ]         │
└─────────────────────────────────────────────┘
```

### Animation Sequence:
1. **Idle:** Wheel stationary, "Spin" button enabled
2. **Spinning:** Wheel rotates rapidly, button disabled
3. **Decelerating:** Wheel slows down gradually
4. **Stopped:** Wheel stops on winner, celebration effect
5. **Winner Display:** Show winner details, enable action buttons

---

## 🛠️ Technical Notes

### Wheel Implementation Options:

**Option A: Canvas-based (Recommended)**
- Use HTML5 Canvas API
- Full control over rendering and animation
- Libraries: `react-canvas-confetti` for celebration

**Option B: CSS/SVG-based**
- Use CSS transforms and animations
- Simpler but less flexible
- May have performance issues with many participants

**Option C: Third-party Library**
- `react-wheel-of-prizes` or similar
- Faster implementation but less customization

### Random Selection Algorithm:
```typescript
// Use crypto.getRandomValues for true randomness
const selectRandomParticipant = (participants: Participant[]) => {
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % participants.length;
  return participants[randomIndex];
};
```

### Animation Timing:
- Total spin duration: 3-5 seconds
- Easing function: `cubic-bezier(0.17, 0.67, 0.12, 0.99)` (deceleration)
- Minimum rotations: 3-5 full spins before stopping

### Convex Queries Needed:
```typescript
// convex/spin.ts
export const getEligibleParticipants = query({
  // Returns all participants (or exclude previous winners if implemented)
  args: {},
  returns: v.array(v.object({ ... })),
  handler: async (ctx) => { ... }
});
```

---

## 📦 Dependencies

### Required Before:
- ✅ STORY-002 (Main Menu) - Navigation link exists
- ✅ STORY-003 (Participant Management) - Need participants to spin

### Blocks:
- STORY-005 (Re-spin Functionality) - Re-spin button created here
- STORY-006 (Save Winners) - Confirm button created here

### Related:
- Works with STORY-005 (Re-spin) and STORY-006 (Save Winners) as integrated workflow

---

## 🧪 Testing Scenarios

### Happy Path:
1. Navigate to `/spin`
2. See wheel with all participant names
3. Click "Spin"
4. Wheel spins for 3-5 seconds
5. Wheel stops on random participant
6. Winner details displayed
7. "Re-spin" and "Confirm Winner" buttons appear

### Edge Cases:
1. No participants → Show message, disable spin
2. 1 participant → Wheel still spins, always selects that person
3. 100+ participants → Wheel segments very small (consider text truncation)
4. Rapid clicking "Spin" → Button disabled during spin

### Visual:
1. Wheel is centered and prominent
2. Participant names readable (or truncated gracefully)
3. Celebration effect is visible but not overwhelming
4. Responsive on tablet and desktop

---

## 📝 Notes

- **Randomness:** Use `crypto.getRandomValues()` not `Math.random()` for fairness
- **Performance:** Test with 100+ participants to ensure smooth animation
- **Accessibility:** Consider adding sound effects (optional, not required for MVP)
- **Integration:** This story creates the UI; STORY-005 and STORY-006 add re-spin and save functionality

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Wheel displays all participants
- ✅ Spin animation is smooth and realistic
- ✅ Random selection is truly random
- ✅ Winner displayed clearly with celebration
- ✅ Re-spin and Confirm buttons visible (functionality in other stories)
- ✅ No participants case handled gracefully
- ✅ No TypeScript or ESLint errors
- ✅ Tested with 1, 10, 50, and 100+ participants

---

**Related PRD Section:** Section 4.3 - Feature #3: Spin the Wheel Page  
**Related Epic Section:** Phase 1 - Core MVP

