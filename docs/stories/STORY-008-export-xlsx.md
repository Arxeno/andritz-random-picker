# User Story #008: Export Winner List to XLSX

**Story ID:** STORY-008  
**Epic:** EPIC-001 - Doorprize Management System  
**Feature:** Feature #5 - Export Winner List to XLSX  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Ready for Development  
**Priority:** P0 (Critical)  
**Story Points:** 5  
**Phase:** Phase 2 - Data Management

---

## 📖 User Story

**As an** event administrator  
**I want** to export the winner list to an Excel file  
**So that** I can share results with family members and keep offline records

---

## 🎯 Business Value

- **Sharing:** Easy to email winner list to family members
- **Record Keeping:** Offline backup of event results
- **Compatibility:** Excel format works with Google Sheets, Numbers, etc.
- **Professionalism:** Clean spreadsheet looks official and organized

---

## 📋 Acceptance Criteria

### AC1: Page Structure
- ✅ Accessible at `/export` route
- ✅ Protected route (requires authentication)
- ✅ Clear page title: "Export Data"
- ✅ Simple, focused interface

### AC2: Export Button
- ✅ Prominent "Export to Excel" button
- ✅ Button shows icon (📥 or download icon)
- ✅ Button disabled if no winners exist
- ✅ Show winner count: "Export X winners to Excel"

### AC3: File Generation
- ✅ Clicking button generates XLSX file
- ✅ File downloads automatically to user's Downloads folder
- ✅ Filename format: `doorprize-winners-YYYY-MM-DD.xlsx`
  - Example: `doorprize-winners-2025-11-05.xlsx`
- ✅ File generation happens client-side (no server upload needed)

### AC4: Excel File Content
- ✅ Sheet name: "Winners"
- ✅ Columns (in order):
  1. Winner Name
  2. Email
  3. Phone Number
  4. Date Won (formatted: "Nov 5, 2025")
  5. Time Won (formatted: "2:45 PM")
- ✅ Header row with bold formatting
- ✅ Data rows sorted chronologically (oldest first for readability)
- ✅ Auto-sized columns (fit content)
- ✅ Professional formatting (borders, alignment)

### AC5: Data Accuracy
- ✅ All confirmed winners included
- ✅ No duplicate entries
- ✅ All fields populated correctly
- ✅ Dates and times formatted correctly
- ✅ Phone numbers formatted consistently

### AC6: File Compatibility
- ✅ File opens correctly in Microsoft Excel
- ✅ File opens correctly in Google Sheets
- ✅ File opens correctly in Apple Numbers
- ✅ File opens correctly in LibreOffice Calc

### AC7: User Feedback
- ✅ Show loading indicator while generating file
- ✅ Show success message after download starts
- ✅ If no winners, show message: "No winners to export yet. Spin the wheel to select winners first."

### AC8: Empty State
- ✅ If no winners, disable export button
- ✅ Show helpful message with link to spin page
- ✅ No error when clicking disabled button

---

## 🎨 User Experience

### Page Layout:
```
┌─────────────────────────────────────────────┐
│ Doorpripe Manager          [Sign Out]       │
├─────────────────────────────────────────────┤
│ ← Back to Menu                              │
│                                             │
│ Export Data                                 │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │         📥                              │ │
│ │                                         │ │
│ │   Export Winner List                    │ │
│ │                                         │ │
│ │   Download all 8 winners as an Excel   │ │
│ │   spreadsheet to share with family.     │ │
│ │                                         │ │
│ │   [  Export 8 Winners to Excel  ]      │ │
│ │                                         │ │
│ │   File: doorprize-winners-2025-11-05    │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ℹ️  The file will download to your          │
│    Downloads folder.                        │
└─────────────────────────────────────────────┘
```

### Empty State:
```
┌─────────────────────────────────────────────┐
│ Export Data                                 │
│                                             │
│         📥                                  │
│                                             │
│   No winners to export yet.                 │
│   Spin the wheel to select winners first.   │
│                                             │
│   [  Go to Spin Wheel  ]                   │
└─────────────────────────────────────────────┘
```

### Excel File Preview:
```
| Winner Name    | Email           | Phone         | Date Won    | Time Won |
|----------------|-----------------|---------------|-------------|----------|
| Alice Johnson  | alice@email.com | (555)123-4567 | Nov 5, 2025 | 2:15 PM  |
| Bob Smith      | bob@email.com   | (555)234-5678 | Nov 5, 2025 | 2:30 PM  |
| Carol Davis    | carol@email.com | (555)345-6789 | Nov 5, 2025 | 2:45 PM  |
```

---

## 🛠️ Technical Notes

### XLSX Library Options:

**Option A: SheetJS (xlsx) - Recommended**
```bash
npm install xlsx
```
- Most popular, well-maintained
- Client-side generation
- Good documentation

**Option B: ExcelJS**
```bash
npm install exceljs
```
- More features (styling, formulas)
- Slightly larger bundle size
- Better for complex formatting

### Implementation Example (SheetJS):
```typescript
import * as XLSX from 'xlsx';

const exportToExcel = (winners: Winner[]) => {
  // Prepare data
  const data = winners.map(w => ({
    'Winner Name': w.participantName,
    'Email': w.participantEmail,
    'Phone Number': w.participantPhone,
    'Date Won': formatDate(w._creationTime),
    'Time Won': formatTime(w._creationTime),
  }));
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Auto-size columns
  const colWidths = [
    { wch: 20 }, // Winner Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 15 }, // Date
    { wch: 10 }, // Time
  ];
  ws['!cols'] = colWidths;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Winners');
  
  // Generate filename
  const filename = `doorprize-winners-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Download
  XLSX.writeFile(wb, filename);
};
```

### Date/Time Formatting:
```typescript
const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
};

const formatTime = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
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
- ✅ STORY-006 (Save Winners) - Need winners to export

### Blocks:
- None (this is a terminal feature)

### Related:
- Can be accessed from STORY-007 (Winner History) via export button

---

## 🧪 Testing Scenarios

### Happy Path:
1. Navigate to `/export`
2. See export button with winner count
3. Click "Export to Excel"
4. File downloads to Downloads folder
5. Open file in Excel → All data correct
6. Open file in Google Sheets → All data correct

### Edge Cases:
1. No winners → Button disabled, show empty state
2. 1 winner → File exports correctly
3. 100 winners → File exports correctly, no performance issues
4. Special characters in names → Exported correctly
5. Long email addresses → Column auto-sized correctly

### File Validation:
1. Filename includes correct date
2. All 5 columns present
3. Header row bold
4. Data sorted chronologically (oldest first)
5. No duplicate rows
6. All fields populated

### Browser Compatibility:
1. Chrome → Download works
2. Firefox → Download works
3. Safari → Download works
4. Edge → Download works

---

## 📝 Notes

- **Client-Side:** No server needed - generate file in browser
- **Bundle Size:** SheetJS adds ~500KB to bundle (acceptable for this feature)
- **Sorting:** Oldest first in export (chronological story), newest first in history view (recent focus)
- **Future:** Could add filters (date range, search), export participants, export to CSV

---

## ✅ Definition of Done

- ✅ All acceptance criteria met
- ✅ Export button generates XLSX file
- ✅ File downloads automatically
- ✅ Filename format correct
- ✅ All data included and accurate
- ✅ File opens in Excel, Google Sheets, Numbers
- ✅ Professional formatting applied
- ✅ Empty state handled gracefully
- ✅ No TypeScript or ESLint errors
- ✅ Tested with 0, 1, 10, and 100 winners

---

**Related PRD Section:** Section 4.5 - Feature #5: Export Winner List to XLSX  
**Related Epic Section:** Phase 2 - Data Management

