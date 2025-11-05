# User Story #003: Participant Management

**Story ID:** STORY-003  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #6 - Participant Management  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 8  
**Phase:** Phase 2 - Data Management

---

## 📖 User Story

**As an** event administrator  
**I want** to add and manage participant information  
**So that** I have a complete list of people eligible to win doorprizes

---

## 🎯 Business Value

- **Efficiency:** Bulk import saves hours vs manual entry for large events
- **Accuracy:** Validation prevents data entry errors
- **Flexibility:** Support both manual entry (small events) and bulk import (large events)
- **Control:** Edit/delete capabilities allow corrections before event starts

---

## 📋 Acceptance Criteria

### AC1: Page Structure
- ✅ Accessible at `/participants` route
- ✅ Protected route (requires authentication)
- ✅ Responsive design for tablet and desktop
- ✅ Clear page title: "Manage Participants"

### AC2: Manual Participant Entry
- ✅ Form with 3 required fields:
  - Full Name (text input)
  - Email (email input with validation)
  - Phone Number (text input with format validation)
- ✅ "Add Participant" button to submit
- ✅ Form validation:
  - All fields required
  - Email must be valid format (user@domain.com)
  - Phone must be valid format (flexible - allow various formats)
- ✅ Success message after adding participant
- ✅ Form clears after successful submission
- ✅ Error messages for validation failures

### AC3: Bulk XLSX Import
- ✅ "Import from Excel" button
- ✅ File upload dialog (accepts .xlsx files only)
- ✅ Download template button (provides sample XLSX with correct columns)
- ✅ Template has 3 columns: Full Name, Email, Phone Number
- ✅ Template includes 2-3 example rows
- ✅ Import validation:
  - Check file format is XLSX
  - Validate all required columns exist
  - Validate each row has all required fields
  - Validate email and phone formats
- ✅ Preview imported data before final save
- ✅ Show count: "X participants ready to import"
- ✅ "Confirm Import" button to save to database
- ✅ "Cancel" button to discard import
- ✅ Error report if validation fails:
  - Show which rows have errors
  - Specify what's wrong with each row
  - Allow user to fix and re-upload

### AC4: Participant List View
- ✅ Table displaying all participants with columns:
  - Full Name
  - Email
  - Phone Number
  - Actions (Edit, Delete buttons)
- ✅ Sorted alphabetically by name (default)
- ✅ Real-time updates (Convex reactive query)
- ✅ Show total count: "X participants"
- ✅ Empty state message if no participants: "No participants yet. Add your first participant above."

### AC5: Search and Filter
- ✅ Search box above table
- ✅ Search filters by name, email, or phone (case-insensitive)
- ✅ Results update as user types (debounced)
- ✅ Show count of filtered results: "Showing X of Y participants"

### AC6: Edit Participant
- ✅ Click "Edit" button opens edit form/modal
- ✅ Pre-populated with current values
- ✅ Same validation as add form
- ✅ "Save Changes" button updates database
- ✅ "Cancel" button discards changes
- ✅ Success message after update

### AC7: Delete Participant
- ✅ Click "Delete" button shows confirmation dialog
- ✅ Confirmation message: "Are you sure you want to delete [Name]? This cannot be undone."
- ✅ "Confirm Delete" button removes from database
- ✅ "Cancel" button closes dialog
- ✅ Cannot delete if participant has already won (show error message)

---

## 🎨 User Experience

### Page Layout:
```
┌─────────────────────────────────────────────┐
│ Doorprize Manager          [Sign Out]       │
├─────────────────────────────────────────────┤
│ ← Back to Menu                              │
│                                             │
│ Manage Participants                         │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Add Participant                         │ │
│ │ [Full Name] [Email] [Phone] [Add]      │ │
│ │                                         │ │
│ │ Or: [Download Template] [Import Excel] │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Search: [____________]                  │ │
│ │                                         │ │
│ │ 42 participants                         │ │
│ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Name    │ Email   │ Phone │ Actions││ │
│ │ ├─────────────────────────────────────┤ │ │
│ │ │ Alice   │ a@e.com │ 555.. │ [E][D] ││ │
│ │ │ Bob     │ b@e.com │ 555.. │ [E][D] ││ │
│ │ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Technical Notes

### XLSX Library:
- Use **SheetJS (xlsx)** or **ExcelJS**
- Install: `npm install xlsx` or `npm install exceljs`
- Both support browser-based file reading and generation

### Convex Functions Needed:
```typescript
// convex/participants.ts
export const addParticipant = mutation({ ... });
export const listParticipants = query({ ... });
export const updateParticipant = mutation({ ... });
export const deleteParticipant = mutation({ ... });
export const bulkAddParticipants = mutation({ ... });
export const checkIfWinner = query({ ... }); // For delete validation
```

### Phone Number Validation:
- Accept various formats: (555) 123-4567, 555-123-4567, 5551234567
- Store in consistent format (e.g., remove formatting, keep digits only)
- Display with formatting for readability

### Email Validation:
- Use standard email regex or HTML5 email input validation
- Check for duplicate emails (optional - warn but allow)

---

## 📦 Dependencies

### Required Before:
- ✅ STORY-002 (Main Menu) - Database schema created, navigation link exists

### Blocks:
- STORY-004 (Spin the Wheel) - Need participants to spin
- STORY-007 (Winner History) - Participant data referenced

---

## 🧪 Testing Scenarios

### Manual Entry:
1. Fill form with valid data → Participant added
2. Leave field empty → Show validation error
3. Invalid email format → Show error
4. Invalid phone format → Show error
5. Add 5 participants → All appear in list

### Bulk Import:
1. Download template → XLSX file downloads
2. Fill template with 10 participants → Upload succeeds
3. Upload file with missing column → Show error
4. Upload file with invalid email in row 5 → Show error for row 5
5. Preview import → See all 10 participants
6. Confirm import → All 10 added to database

### List Management:
1. Search for "Alice" → Only Alice shown
2. Edit participant → Changes saved
3. Delete participant (no wins) → Deleted successfully
4. Delete participant (has won) → Show error, prevent deletion

---

## 📝 Notes

- **Data Quality:** Validation is critical - bad data = bad event experience
- **UX:** Bulk import is key for large family gatherings (50+ people)
- **Template:** Make template foolproof - clear column headers, example data
- **Performance:** For 100+ participants, consider pagination (not required for MVP)

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Manual entry works with validation
- ✅ Bulk import works with template download
- ✅ List view shows all participants
- ✅ Search/filter works correctly
- ✅ Edit and delete work correctly
- ✅ Cannot delete winners
- ✅ No TypeScript or ESLint errors
- ✅ Tested with 50+ participants

---

**Related PRD Section:** Section 4.6 - Feature #6: Participant Management  
**Related Epic Section:** Phase 2 - Data Management

