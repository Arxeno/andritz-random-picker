# Product Requirements Document (PRD)

## Doorprize Management System for Family Gatherings

**Version:** 2.0
**Date:** 2025-11-05
**Product Manager:** John
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Overview

A web-based doorprize management system designed for family gathering events. The system enables event administrators to manage participants and conduct interactive spin-the-wheel sessions with winner tracking and export capabilities.

### 1.2 Problem Statement

Family gatherings often include doorprize/raffle activities, but current solutions are either:

- Manual (paper-based, prone to errors, lacks transparency)
- Generic raffle tools (not tailored for family events, poor UX)
- No ability to review and re-spin before finalizing winners
- Difficult to track and export winner history

### 1.3 Solution

A purpose-built doorprize system that:

- Simplifies participant management with bulk import
- Provides engaging spin-the-wheel experience with re-spin capability
- Maintains complete winner history for review
- Enables easy data export for record-keeping

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals

1. **Efficiency:** Reduce event setup time by 80% vs manual methods
2. **Engagement:** Create memorable, transparent prize selection experience
3. **Fairness:** Ensure equal opportunity for all participants
4. **Simplicity:** Enable non-technical users to run the system

### 2.2 Success Metrics

- Setup time < 15 minutes for 50 participants
- 100% of winners successfully recorded and exportable
- Admin can complete full workflow without technical support
- Zero data loss during event

---

## 3. User Personas

### 3.1 Primary User: Event Administrator

- **Profile:** Family member organizing the gathering (age 25-60)
- **Tech Savvy:** Basic to intermediate
- **Goals:**
  - Run smooth, fair doorprize event
  - Keep family members engaged and happy
  - Maintain records of winners
- **Pain Points:**
  - Manual tracking is error-prone
  - Lack of transparency causes complaints
  - Need flexibility to re-spin if issues occur

### 3.2 Secondary User: Event Attendees (Family Members)

- **Profile:** All ages (children to elderly)
- **Goals:**
  - Participate in fun doorprize activity
  - See fair, transparent selection process
  - Know if they won
- **Pain Points:**
  - Can't see selection process
  - Unclear if process is fair
  - Don't know who won what

---

## 4. Feature Requirements

### 4.1 Feature #1: Login Page

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to securely log in so that only authorized users can manage the event.

**Requirements:**

- Single hardcoded admin user (username/password)
- Simple login form (username, password fields)
- Session management (stay logged in)
- Logout functionality
- Error handling for invalid credentials

**Acceptance Criteria:**

- ✅ Only correct credentials grant access
- ✅ Invalid credentials show error message
- ✅ Session persists across page refreshes
- ✅ Logout clears session

---

### 4.2 Feature #2: Main Menu Page

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want a central navigation hub so I can easily access all system features.

**Requirements:**

- Clear navigation to all major sections:
  - Participant Management
  - Spin the Wheel
  - Winner History
  - Export Data
- Dashboard showing quick stats:
  - Total participants
  - Total winners
- Responsive design for tablet/desktop use

**Acceptance Criteria:**

- ✅ All navigation links work correctly
- ✅ Dashboard stats update in real-time
- ✅ Accessible from any page (navigation bar)

---

### 4.3 Feature #3: Spin the Wheel Page

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to conduct spin sessions so I can select winners fairly and engagingly.

**Requirements:**

- Visual spinning wheel animation
- Random winner selection from all participants
- Winner announcement with celebration effect
- Multiple re-spin capability (before confirmation)
- Confirm and save winner button
- Clear indication of current spin result

**Acceptance Criteria:**

- ✅ Wheel spins smoothly with animation
- ✅ Selection is truly random
- ✅ Winner is clearly displayed
- ✅ Can re-spin unlimited times before confirming
- ✅ Only confirmed winners are saved
- ✅ Cannot spin if no participants exist

---

### 4.4 Feature #4: Save Winners to Database

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want winners automatically saved so I have a permanent record.

**Requirements:**

- Save winner only after admin confirmation
- Store: Winner name, email, phone, timestamp
- Data persists across sessions
- Cannot be deleted (audit integrity)

**Acceptance Criteria:**

- ✅ Winner saved immediately after confirmation
- ✅ All participant fields captured
- ✅ Data persists across sessions
- ✅ Timestamp accurate to the second

---

### 4.5 Feature #5: Export Winner List to XLSX

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to export winner data so I can share results and keep records.

**Requirements:**

- Export all winners to Excel (.xlsx) format
- Include columns: Winner Name, Email, Phone, Date/Time Won
- File naming: `doorprize-winners-[date].xlsx`
- Download directly to admin's device

**Acceptance Criteria:**

- ✅ File downloads successfully
- ✅ All winner data included
- ✅ File opens correctly in Excel/Google Sheets
- ✅ Data formatted properly (readable)

---

### 4.6 Feature #6: Participant Management

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to add participants so the system knows who can win prizes.

**Requirements:**

- **Manual Entry:**
  - Form to add individual participants
  - Required fields: Full Name, Email, Phone Number
  - Validation for email and phone formats
- **Bulk Import:**
  - Upload XLSX file with participant data
  - Template download available
  - Validation and error reporting
  - Preview before final import
- **Participant List:**
  - View all participants in table format
  - Edit participant details
  - Delete participants
  - Search/filter participants

**Acceptance Criteria:**

- ✅ Manual entry saves correctly
- ✅ XLSX import processes 100+ participants
- ✅ Invalid data shows clear error messages
- ✅ Participant list updates in real-time
- ✅ Can edit/delete participants

---

### 4.7 Feature #7: Re-spin Functionality

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to re-spin multiple times before confirming so I can handle technical issues or disputes.

**Requirements:**

- Allow unlimited re-spins before confirmation
- Each re-spin performs new random selection
- Clear visual indication of "pending" vs "confirmed" state
- Re-spin button always available until confirmation
- Confirmation is explicit action (separate button)

**Acceptance Criteria:**

- ✅ Can re-spin unlimited times
- ✅ Each spin is independent and random
- ✅ Pending winner clearly marked as "not confirmed"
- ✅ Re-spin button disabled after confirmation
- ✅ Confirmation requires explicit user action

---

### 4.8 Feature #8: Winner History View

**Priority:** P0 (Must Have)
**User Story:** As an admin, I want to view all past winners so I can review results and verify fairness.

**Requirements:**

- Dedicated page showing all confirmed winners
- Display in chronological order (most recent first)
- Show: Winner name, email, phone, timestamp
- Search/filter by name or date
- Total winner count displayed
- Read-only view (cannot edit or delete)

**Acceptance Criteria:**

- ✅ All confirmed winners displayed
- ✅ Sorted by timestamp (newest first)
- ✅ Search functionality works correctly
- ✅ Data cannot be modified from this view
- ✅ Page loads quickly even with 100+ winners

---

## 5. User Flows

### 5.1 Event Setup Flow

```text
1. Admin logs in
2. Navigate to Participant Management
3. Import participants from XLSX OR add manually
4. Review participant list
5. Ready to start event
```

### 5.2 Spin Session Flow

```text
1. Admin navigates to Spin the Wheel
2. Click "Spin" button
3. Wheel spins and selects random winner
4. Winner displayed with celebration
5. Admin reviews result
6. If needed: Click "Re-spin" (repeat steps 3-5)
7. When satisfied: Click "Confirm Winner"
8. Winner saved to database
9. Repeat for next round
```

### 5.3 Post-Event Flow

```text
1. Admin navigates to Winner History
2. Review all winners
3. Click "Export to Excel"
4. Download XLSX file
5. Share with family/keep records
```

---

## 6. Technical Requirements

### 6.1 Technology Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Convex (real-time database)
- **Authentication:** Convex Auth (hardcoded credentials)
- **File Export:** XLSX library (SheetJS/ExcelJS)
- **Animations:** CSS animations or Framer Motion

### 6.2 Data Schema

**Participants Table:**

```typescript
{
  id: string
  fullName: string
  email: string
  phone: string
  createdAt: timestamp
}
```

**Winners Table:**

```typescript
{
  id: string
  participantId: string
  participantName: string
  participantEmail: string
  participantPhone: string
  timestamp: timestamp
}
```

### 6.3 Non-Functional Requirements

- **Performance:** Page load < 2 seconds
- **Reliability:** 99.9% uptime during event
- **Usability:** No training required for basic admin
- **Compatibility:** Works on Chrome, Firefox, Safari, Edge (latest versions)
- **Responsive:** Optimized for tablets (iPad) and desktop
- **Accessibility:** WCAG 2.1 Level AA compliance

---

## 7. Risks & Mitigations

| Risk                                  | Impact | Probability | Mitigation                                                  |
| ------------------------------------- | ------ | ----------- | ----------------------------------------------------------- |
| Random selection not truly random     | High   | Low         | Use cryptographically secure random function                |
| System crash during event             | High   | Low         | Offline mode + local storage backup                         |
| Import file format errors             | Medium | High        | Clear template + validation + error messages                |
| Re-spin abused (never confirming)     | Medium | Medium      | Add guidance/best practices for admin                       |
| Data loss on browser crash            | High   | Low         | Auto-save to Convex database in real-time                   |
| Participant list too large to display | Low    | Low         | Pagination + search/filter functionality                    |

---

## 8. Implementation Phases

### Phase 1: Core MVP (Weeks 1-2)

**Features:** #1-4 (Login, Menu, Spin, Save)

- Basic authentication
- Simple spin wheel with random selection
- Database integration
- Winner confirmation and save

### Phase 2: Data Management (Week 3)

**Features:** #5-6 (Export, Participants)

- XLSX export functionality
- Participant management (manual + bulk import)
- Participant list view

### Phase 3: Enhanced UX (Week 4)

**Features:** #7-8 (Re-spin, History)

- Re-spin functionality
- Winner history view
- Search/filter capabilities

### Phase 4: Polish & Testing (Week 5)

- Bug fixes
- UX improvements
- End-to-end testing
- Performance optimization

---

## 9. Open Questions

1. Should there be a "practice mode" to test the wheel before the event?
2. Do we need to support multiple events/sessions (archive past events)?
3. Should there be a limit on re-spins (e.g., max 5 times)?
4. Do we need sound effects for the spinning wheel?
5. Should the system prevent spinning if there are no participants?

---

## 10. Future Enhancements (Post-MVP)

- **Multi-event support:** Archive past events and create new ones
- **Display/Projection mode:** Full-screen view for audience
- **Prize management:** Track multiple prizes with sessions
- **Duplicate winner prevention:** Automatically exclude previous winners
- **Email notifications:** Auto-email winners with details
- **Custom branding:** Colors, logos, themes
- **Sound effects:** Spinning sounds and celebration music
- **Mobile app version:** Native iOS/Android apps
- **Analytics dashboard:** Event statistics and insights
- **Multi-language support:** Internationalization

---

## 11. Appendix

### 11.1 Glossary

- **Participant:** Family member eligible to win a doorprize
- **Winner:** Participant who has been selected and confirmed
- **Spin Session:** Single instance of spinning the wheel to select a winner
- **Re-spin:** Ability to spin again before confirming the winner
- **Confirmation:** Explicit action by admin to save the winner

### 11.2 References

- Next.js Documentation: <https://nextjs.org/docs>
- Convex Documentation: <https://docs.convex.dev>
- SheetJS (XLSX): <https://sheetjs.com>

---

**Document Status:** Ready for Review
**Next Steps:** Review with stakeholders → Approve → Begin development

**Changelog:**

- v2.0 (2025-11-05): Updated to reflect 8 core features based on app-idea.md
- v1.0 (2025-11-05): Initial draft with 9 features
