# Participant Self-Registration Feature

## Overview

The participant self-registration feature allows participants to register themselves for the event without requiring admin intervention or authentication. This provides a convenient way for participants to sign up while maintaining data integrity through duplicate detection.

## Access

### Public Registration Page

- **URL**: `/register`
- **Authentication**: None required (public access)
- **Purpose**: Allow participants to self-register for the event

### Admin Participant Management

- **URL**: `/participants`
- **Authentication**: Required (admin only)
- **Purpose**: Admin can view all participants and manually add/edit/delete participants

## Features

### 1. Self-Registration Form

Participants can register by providing:

- **Full Name** (required) - Text input field
- **Department** (required) - Dropdown selection with predefined departments

### 2. Duplicate Detection

The system automatically checks for duplicates based on:

- Full name (case-insensitive)
- Department (case-insensitive)

If a participant with the same name AND department already exists, registration is rejected with an error message.

### 3. User Experience

#### Success Flow

1. Participant fills in name and department
2. Clicks "Register" button
3. System validates and checks for duplicates
4. Success message appears with checkmark icon
5. Form clears automatically
6. Success state displays for 3 seconds
7. Form becomes available again for next registration

#### Error Flow

1. Participant fills in name and department
2. Clicks "Register" button
3. System detects duplicate or validation error
4. Error toast notification appears
5. Form remains filled for correction
6. Participant can modify and retry

### 4. Visual Design

- **Gradient background**: Professional blue gradient
- **Centered card layout**: Clean, focused design
- **Icon indicators**: Visual feedback for actions
- **Loading states**: Spinner during submission
- **Success animation**: Checkmark confirmation
- **Responsive**: Works on all screen sizes

## Technical Implementation

### Backend (Convex)

#### New Mutation: `registerParticipant`

**File**: `convex/participants.ts`

```typescript
export const registerParticipant = mutation({
  args: {
    fullName: v.string(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    // Validates inputs
    // Checks for duplicates (case-insensitive)
    // Inserts participant if no duplicate found
    // Throws error if duplicate exists
  },
});
```

**Validation Rules**:

- Full name must not be empty
- Department must not be empty
- Name and department combination must be unique (case-insensitive)

**Error Messages**:

- "Full name is required"
- "Please select your department"
- "A participant with this name and department already exists"

### Frontend (Next.js)

#### Registration Page

**File**: `app/register/page.tsx`

**Key Features**:

- Client-side form validation
- Loading states during submission
- Success/error toast notifications
- Auto-clearing form on success
- Temporary success state display
- Disabled inputs during submission

**Components Used**:

- `Card` - Container
- `Input` - Text input for name
- `Select` - Dropdown for department selection
- `Label` - Field labels
- `Button` - Submit button
- `toast` - Notifications
- `UserPlus`, `CheckCircle`, `Loader2` - Icons
- `DEPARTMENTS` - Predefined department list from constants

## Usage

### For Participants

1. Navigate to `/register` (or share this link with participants)
2. Enter your full name
3. Enter your department
4. Click "Register"
5. Wait for confirmation message
6. Done! You're registered for the event

### For Administrators

#### Sharing the Registration Link

Share the registration page URL with participants:

```
https://your-domain.com/register
```

Or create a QR code pointing to this URL for easy access.

#### Monitoring Registrations

1. Go to `/participants` (admin page)
2. View all registered participants
3. Search/filter participants
4. Edit or delete if needed

#### Handling Duplicates

If a participant tries to register twice:

- They will see an error message
- No duplicate entry will be created
- Admin can manually check and resolve if needed

## Data Structure

### Participant Schema

```typescript
{
  _id: Id<"participants">,
  fullName: string,
  department: string,
  _creationTime: number
}
```

## Comparison: Admin vs Self-Registration

| Feature | Admin Page (`/participants`) | Self-Registration (`/register`) |
|---------|------------------------------|----------------------------------|
| **Authentication** | Required | Not required |
| **Access** | Admin only | Public |
| **Duplicate Check** | No (allows duplicates) | Yes (prevents duplicates) |
| **Bulk Import** | Yes (Excel) | No |
| **Edit/Delete** | Yes | No |
| **View All** | Yes | No |
| **Purpose** | Management | Registration |

## Security Considerations

### Public Access

- No authentication required by design
- Anyone with the URL can register
- Consider adding CAPTCHA if spam becomes an issue

### Duplicate Prevention

- Case-insensitive matching prevents simple duplicates
- Same person can register if they use different department
- Admin can manually remove duplicates if needed

### Rate Limiting

- Consider implementing rate limiting if needed
- Convex has built-in rate limiting for mutations
- Monitor for abuse patterns

## Future Enhancements

### Potential Additions

1. **Email Verification**
   - Add email field
   - Send confirmation email
   - Verify email before finalizing registration

2. **CAPTCHA**
   - Add reCAPTCHA or similar
   - Prevent automated spam registrations

3. **Registration Confirmation**
   - Send confirmation email/SMS
   - Provide registration number
   - Allow participants to check their status

4. **Registration Period**
   - Set start/end dates for registration
   - Automatically close registration
   - Display countdown timer

5. **Additional Fields**
   - Phone number
   - Email address
   - Employee ID
   - Custom fields

6. **QR Code Generation**
   - Generate unique QR code for each participant
   - Use for check-in at event
   - Track attendance

7. **Registration Analytics**
   - Track registration sources
   - Monitor registration rate
   - Department-wise statistics

## Troubleshooting

### Common Issues

#### "A participant with this name and department already exists"

- **Cause**: Duplicate registration attempt
- **Solution**: Check if you're already registered, or contact admin

#### Form not submitting

- **Cause**: Network issue or validation error
- **Solution**: Check internet connection, ensure all fields are filled

#### Success message not appearing

- **Cause**: Slow network or error
- **Solution**: Check `/participants` page to verify registration

### For Administrators

#### Participant claims they can't register

1. Check if they're already in the system
2. Verify the exact name and department they're using
3. Check for typos or case differences
4. Manually add them if needed

#### Multiple registrations from same person

1. Use search in `/participants` page
2. Find duplicate entries
3. Delete duplicates manually
4. Inform participant of their correct registration

## Testing

### Test Cases

1. **Valid Registration**
   - Fill valid name and department
   - Should succeed and show success message

2. **Duplicate Registration**
   - Register same name and department twice
   - Second attempt should fail with error

3. **Empty Fields**
   - Try to submit with empty name
   - Try to submit with empty department
   - Should show validation errors

4. **Case Sensitivity**
   - Register "John Doe" in "IT"
   - Try "john doe" in "it"
   - Should detect as duplicate

5. **Different Department**
   - Register "John Doe" in "IT"
   - Register "John Doe" in "HR"
   - Should allow both (different departments)

## Related Files

- `app/register/page.tsx` - Registration page UI
- `convex/participants.ts` - Backend mutations and queries
- `convex/schema.ts` - Database schema
- `app/participants/page.tsx` - Admin management page

## Support

For issues or questions:

1. Check this documentation
2. Review error messages carefully
3. Contact system administrator
4. Check `/participants` page to verify registration status
