# Epic: Doorprize Management System for Family Gatherings

**Epic ID:** EPIC-001  
**Created:** 2025-11-05  
**Product Manager:** John  
**Status:** 📋 Planned  
**Priority:** P0 (Critical)  
**Target Release:** v1.0 MVP

---

## 📊 Epic Overview

### Business Goal

Build a complete web-based doorprize management system that enables family event organizers to efficiently manage participants, conduct fair and engaging prize drawings, and maintain comprehensive winner records.

### Problem Statement

Family gatherings currently lack a reliable, user-friendly solution for managing doorprize activities. Existing approaches are either manual (error-prone, lacks transparency) or use generic tools not tailored for family events. Event organizers need a purpose-built system that:

- Eliminates manual tracking errors
- Provides transparent, fair winner selection
- Enables flexible re-spin capability for dispute resolution
- Maintains complete audit trail of all winners
- Simplifies data import/export for record-keeping

### Target Users

- **Primary:** Event administrators (family members organizing gatherings, age 25-60, basic-to-intermediate tech skills)
- **Secondary:** Event attendees (family members of all ages participating in doorprize activities)

---

## 🎯 Success Criteria

### Business Metrics

- ✅ Reduce event setup time by 80% compared to manual methods (target: <15 min for 50 participants)
- ✅ 100% of winners successfully recorded and exportable
- ✅ Zero data loss during events
- ✅ Admin can operate system without technical support

### User Experience Metrics

- ✅ Admin completes full workflow without assistance
- ✅ Positive feedback from event attendees on fairness/transparency
- ✅ System used for multiple events by same organizer (repeat usage)

### Technical Metrics

- ✅ Page load time < 2 seconds
- ✅ 99.9% uptime during events
- ✅ Support 100+ participants without performance degradation

---

## 📦 Features Included

### Core Features (8 Total)

#### 1. **Authentication & Access Control**
- Single hardcoded admin login
- Session management
- Secure logout

#### 2. **Navigation & Dashboard**
- Central menu hub
- Quick stats display (participants, winners)
- Responsive design for tablets/desktop

#### 3. **Interactive Spin-the-Wheel**
- Visual spinning animation
- Random winner selection
- Celebration effects
- Re-spin capability (unlimited before confirmation)
- Explicit winner confirmation

#### 4. **Winner Persistence**
- Auto-save confirmed winners to database
- Immutable audit trail
- Real-time data sync

#### 5. **Data Export**
- Export winners to XLSX format
- Formatted columns (Name, Email, Phone, Timestamp)
- One-click download

#### 6. **Participant Management**
- Manual participant entry (form-based)
- Bulk XLSX import with validation
- Participant list view (table format)
- Edit/delete capabilities
- Search/filter functionality

#### 7. **Re-spin Functionality**
- Unlimited re-spins before confirmation
- Independent random selection per spin
- Clear pending vs confirmed states
- Explicit confirmation action required

#### 8. **Winner History View**
- Chronological display (newest first)
- Read-only audit view
- Search/filter by name or date
- Performance optimized for 100+ winners

---

## 🗺️ User Journey

### Pre-Event Setup
```
Admin → Login → Navigate to Participants → Import XLSX / Add Manually → Review List → Ready
```

### During Event (Per Prize Round)
```
Admin → Spin Wheel → Review Winner → Re-spin (if needed) → Confirm Winner → Saved to DB → Next Round
```

### Post-Event
```
Admin → View Winner History → Export to XLSX → Download → Share/Archive
```

---

## 🏗️ Technical Architecture

### Technology Stack

- **Frontend:** Next.js 14+ (React), TypeScript, Tailwind CSS
- **Backend:** Convex (real-time database, serverless functions)
- **Authentication:** Convex Auth (hardcoded credentials)
- **File Handling:** XLSX library (SheetJS/ExcelJS)
- **Animations:** CSS animations or Framer Motion
- **Deployment:** Vercel (recommended for Next.js)

### Data Models

**Participants:**
- id, fullName, email, phone, createdAt

**Winners:**
- id, participantId, participantName, participantEmail, participantPhone, timestamp

---

## 📅 Implementation Timeline

### Phase 1: Core MVP (Weeks 1-2)
**Features:** Login, Menu, Spin, Save Winners

- [ ] Set up Next.js + Convex project structure
- [ ] Implement authentication system
- [ ] Build main menu/dashboard
- [ ] Create spin wheel component with animations
- [ ] Implement random selection algorithm
- [ ] Database schema and winner persistence
- [ ] Basic error handling

**Deliverable:** Working spin system with winner saving

---

### Phase 2: Data Management (Week 3)
**Features:** Export, Participant Management

- [ ] XLSX export functionality
- [ ] Participant manual entry form
- [ ] Bulk XLSX import with validation
- [ ] Participant list view (table)
- [ ] Edit/delete participant operations
- [ ] Search and filter capabilities
- [ ] Download XLSX template

**Deliverable:** Complete participant and data management

---

### Phase 3: Enhanced UX (Week 4)
**Features:** Re-spin, Winner History

- [ ] Re-spin button and state management
- [ ] Pending vs confirmed visual indicators
- [ ] Winner history page
- [ ] Chronological sorting
- [ ] Search/filter in history
- [ ] Performance optimization for large datasets

**Deliverable:** Full feature set with enhanced UX

---

### Phase 4: Polish & Testing (Week 5)

- [ ] End-to-end testing (all user flows)
- [ ] Cross-browser compatibility testing
- [ ] Responsive design verification (tablet/desktop)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Bug fixes and refinements
- [ ] User acceptance testing
- [ ] Documentation (user guide)

**Deliverable:** Production-ready v1.0 MVP

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Random selection not truly random | High | Use crypto.getRandomValues() or equivalent |
| System crash during event | High | Implement offline mode + local storage backup |
| XLSX import errors | Medium | Clear template, validation, detailed error messages |
| Re-spin abuse (never confirming) | Medium | Add UI guidance, consider optional re-spin limit |
| Data loss on browser crash | High | Real-time auto-save to Convex database |
| Large participant lists slow UI | Low | Pagination, virtualization, search/filter |

---

## 🔗 Dependencies

### External Dependencies
- Convex account and project setup
- XLSX library (npm package)
- Next.js and React ecosystem
- Vercel deployment (optional but recommended)

### Internal Dependencies
- None (greenfield project)

---

## 📋 Acceptance Criteria

### Epic Complete When:

- ✅ All 8 features implemented and tested
- ✅ Admin can complete full event workflow without errors
- ✅ All user flows documented in PRD work correctly
- ✅ Data persists correctly across sessions
- ✅ XLSX import/export functions properly
- ✅ Re-spin functionality works as specified
- ✅ Winner history displays correctly
- ✅ System meets performance requirements (<2s load, 99.9% uptime)
- ✅ Responsive design works on tablets and desktop
- ✅ No critical or high-priority bugs
- ✅ User acceptance testing passed

---

## 📚 Related Documents

- [Product Requirements Document (PRD)](./prd.md) - Detailed feature specifications
- [App Idea](./app-idea.md) - Original concept and requirements

---

## 🔮 Future Enhancements (Post-MVP)

*Not included in this epic - for future consideration:*

- Multi-event support with archiving
- Display/projection mode for audience viewing
- Prize management with session tracking
- Automatic duplicate winner prevention
- Email notifications to winners
- Custom branding (colors, logos, themes)
- Sound effects and music
- Mobile app versions (iOS/Android)
- Analytics dashboard
- Multi-language support

---

## 📝 Notes

- This is a brownfield epic for a new project
- Focus on MVP features only - resist scope creep
- Prioritize simplicity and reliability over advanced features
- Target non-technical users - UX is critical
- Family event context means fun, engaging experience is important

---

**Epic Status:** 📋 Ready for Development  
**Next Action:** Break down into user stories and begin Phase 1 implementation

**Changelog:**
- 2025-11-05: Epic created based on PRD v2.0

