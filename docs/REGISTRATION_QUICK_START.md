# Participant Registration - Quick Start Guide

## 🚀 For Event Organizers

### Step 1: Share the Registration Link

Share this URL with your participants:

```
https://your-domain.com/register
```

**Ways to share:**

- 📧 Email the link
- 💬 Post in company chat/Slack
- 📱 Create a QR code
- 📋 Include in event announcements
- 🌐 Add to company intranet

### Step 2: Monitor Registrations

1. Go to `/participants` (admin page)
2. See all registered participants in real-time
3. Use search to find specific participants
4. Export data if needed

### Step 3: Manage Participants (Optional)

- **Add manually**: Use the form on `/participants` page
- **Bulk import**: Import from Excel file
- **Edit**: Click edit icon on any participant
- **Delete**: Click delete icon (if not a winner)

---

## 👥 For Participants

### How to Register

1. **Open the registration page**
   - Click the link provided by your event organizer
   - Or navigate to `/register`

2. **Fill in your information**
   - Enter your **Full Name**
   - Select your **Department** from the dropdown

3. **Click "Register"**
   - Wait for the confirmation message
   - You'll see a green checkmark when successful

4. **Done!**
   - You're now registered for the event
   - No need to register again

### ✅ Success

When registration is successful, you'll see:

- ✅ Green checkmark icon
- "Registration Successful!" message
- "You're all set for the event. Good luck!" confirmation

### ❌ Common Errors

#### "A participant with this name and department already exists"

- **Meaning**: You're already registered
- **Action**: No need to register again
- **Note**: Contact organizer if you think this is an error

#### "Please enter your full name"

- **Meaning**: Name field is empty
- **Action**: Fill in your full name

#### "Please select your department"

- **Meaning**: Department not selected
- **Action**: Select your department from the dropdown

---

## 📋 Registration Rules

### ✅ Allowed

- One registration per person per department
- Same name in different departments (e.g., John Doe in IT and John Doe in HR)

### ❌ Not Allowed

- Duplicate registrations (same name AND department)
- Empty name or department
- Special characters that might cause issues

### 🔍 Duplicate Detection

- System checks for existing participants
- Comparison is **case-insensitive**
  - "John Doe" = "john doe" = "JOHN DOE"
- Both name AND department must match to be considered duplicate

---

## 💡 Tips

### For Participants

- ✅ Use your official/full name
- ✅ Select the correct department from the dropdown
- ✅ Double-check your selection before submitting
- ❌ Don't register multiple times
- ❌ Don't use nicknames or abbreviations

### For Organizers

- 📢 Announce registration opening clearly
- 📅 Set a registration deadline
- 📊 Monitor registration numbers regularly
- 🔍 Check for any unusual entries
- 📧 Send reminders before deadline
- ✅ Verify participant list before event

---

## 🎯 Quick Reference

| Action | URL | Auth Required |
|--------|-----|---------------|
| Register as participant | `/register` | No |
| Manage participants (admin) | `/participants` | Yes |
| View winners | `/winners` | Yes |
| Spin wheel | `/spin` | Yes |

---

## 📞 Support

### For Participants

If you encounter issues:

1. Try refreshing the page
2. Check your internet connection
3. Verify you entered all information correctly
4. Contact your event organizer

### For Organizers

If participants report issues:

1. Check if they're already registered (`/participants` page)
2. Verify the exact name and department they're using
3. Manually add them if needed
4. Check for typos or case differences

---

## 🎨 What Participants Will See

### Registration Form

```
┌─────────────────────────────────────┐
│         Event Registration          │
│  Register yourself for the lucky    │
│         draw event                  │
├─────────────────────────────────────┤
│                                     │
│  Full Name                          │
│  [Enter your full name        ]    │
│                                     │
│  Department                         │
│  [Enter your department       ]    │
│                                     │
│  [        Register        ]         │
│                                     │
│  By registering, you confirm that   │
│  the information provided is        │
│  accurate.                          │
└─────────────────────────────────────┘
```

### Success State

```
┌─────────────────────────────────────┐
│         Event Registration          │
│  Register yourself for the lucky    │
│         draw event                  │
├─────────────────────────────────────┤
│                                     │
│            ✅                        │
│                                     │
│    Registration Successful!         │
│                                     │
│  You're all set for the event.      │
│         Good luck!                  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔗 Related Pages

- **Admin Dashboard**: `/` - View statistics
- **Manage Participants**: `/participants` - Admin only
- **Manage Prizes**: `/prizes` - Admin only
- **Spin Wheel**: `/spin` - Admin only
- **Winners**: `/winners` - View all winners
- **Export**: `/export` - Download winner data

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't access `/register` | Check URL, try refreshing |
| Form won't submit | Check all fields are filled |
| "Already exists" error | You're already registered |
| Success message doesn't show | Check `/participants` to verify |
| Page loads slowly | Check internet connection |

---

## 📊 Example Registration Flow

```
Participant receives link
        ↓
Opens /register page
        ↓
Fills name: "Jane Smith"
Fills department: "Marketing"
        ↓
Clicks "Register"
        ↓
System checks for duplicates
        ↓
    No duplicate found
        ↓
Participant added to database
        ↓
Success message displayed
        ↓
Form clears automatically
        ↓
Ready for next registration
```

---

## 🎉 You're All Set

The registration system is ready to use. Share the link with your participants and let them register themselves!

**Need help?** Check the full documentation in `docs/PARTICIPANT_REGISTRATION.md`
