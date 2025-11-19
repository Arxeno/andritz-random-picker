# QR Code Display Page - Documentation

## Overview

The QR Code Display page (`/register-qr`) is designed to be displayed on a projector or large screen during events. It shows a large, scannable QR code that participants can scan with their smartphones to quickly access the registration page.

## Access

- **URL**: `/register-qr`
- **Authentication**: Not required (public access)
- **Purpose**: Display QR code for easy participant registration

## Features

### 1. Large QR Code Display

- **Size**: 400x400 pixels QR code
- **Error Correction**: High level (H) - can still be scanned even if partially obscured
- **Margins**: Included for better scanning
- **Colors**: Black on white for maximum contrast and readability

### 2. Projector-Optimized Design

- **Large Text**: Easy to read from a distance
- **High Contrast**: Clear visibility on projectors
- **Centered Layout**: Optimal viewing from any angle
- **Professional Design**: Blue gradient background with card layout

### 3. Clear Instructions

Step-by-step instructions displayed prominently:
1. Open Camera
2. Scan QR Code
3. Register

### 4. URL Display

- Shows the full registration URL below the QR code
- Allows manual entry if QR scanning doesn't work
- Monospace font for easy reading

### 5. Visual Elements

- QR code icon in header
- Smartphone icon in footer
- Numbered steps with icons
- Clean, professional layout

## Technical Details

### QR Code Library

**Package**: `qrcode.react`
- Version: 4.2.0
- Type: SVG-based QR code generation
- Features: High error correction, customizable size and colors

### QR Code Configuration

```typescript
<QRCodeSVG
  value={registrationUrl}        // URL to encode
  size={400}                      // 400x400 pixels
  level="H"                       // High error correction
  includeMargin={true}            // Add white margin
  bgColor="#ffffff"               // White background
  fgColor="#000000"               // Black foreground
/>
```

### Error Correction Levels

- **L (Low)**: ~7% error correction
- **M (Medium)**: ~15% error correction
- **Q (Quartile)**: ~25% error correction
- **H (High)**: ~30% error correction ✅ (Used)

High level chosen for reliability in various lighting conditions and partial obstruction.

## Usage

### For Event Organizers

#### Setup

1. **Open the QR page**
   ```
   Navigate to: https://your-domain.com/register-qr
   ```

2. **Display on projector**
   - Connect laptop/computer to projector
   - Open browser in fullscreen mode (F11)
   - Navigate to `/register-qr`
   - Ensure QR code is clearly visible

3. **Test scanning**
   - Test with your own phone before the event
   - Verify the QR code redirects to registration page
   - Check that registration form works correctly

#### During Event

1. **Keep page displayed**
   - Leave the QR page open throughout registration period
   - Ensure projector stays on
   - Monitor for any technical issues

2. **Assist participants**
   - Help those having trouble scanning
   - Provide manual URL if needed
   - Direct to registration page

3. **Monitor registrations**
   - Check `/participants` page periodically
   - Track registration numbers
   - Verify data quality

### For Participants

#### How to Scan

1. **Open camera app**
   - Use built-in camera app (iOS/Android)
   - No special QR scanner app needed
   - Ensure camera permissions are enabled

2. **Point at QR code**
   - Hold phone steady
   - Keep QR code in frame
   - Wait for notification/link to appear

3. **Tap notification**
   - Tap the link that appears
   - Opens registration page in browser
   - Fill in registration form

#### Troubleshooting

**QR code won't scan:**
- Move closer or farther from screen
- Ensure good lighting
- Try different angle
- Use manual URL instead

**Link doesn't open:**
- Check internet connection
- Manually type URL shown below QR code
- Ask event organizer for assistance

## Display Recommendations

### Projector Settings

- **Brightness**: Medium to high
- **Contrast**: High
- **Resolution**: 1080p or higher recommended
- **Screen Size**: Large enough for participants to scan from 2-3 meters away

### Room Setup

- **Lighting**: Moderate - not too dark, not too bright
- **Position**: QR code at eye level or slightly above
- **Distance**: Participants should be 2-5 meters from screen
- **Angle**: Screen should be visible from multiple angles

### Browser Settings

- **Fullscreen Mode**: Press F11 (or Fn+F11 on some laptops)
- **Zoom**: 100% (default) or adjust if needed
- **Disable Sleep**: Prevent screen from sleeping
- **Disable Screensaver**: Turn off screensaver

## Design Specifications

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│         [QR Icon]                       │
│     Event Registration                  │
│  Scan to Register for Lucky Draw        │
│                                         │
│         ┌─────────────┐                 │
│         │             │                 │
│         │  QR CODE    │                 │
│         │   400x400   │                 │
│         │             │                 │
│         └─────────────┘                 │
│                                         │
│  [1] Open Camera                        │
│  [2] Scan QR Code                       │
│  [3] Register                           │
│                                         │
│  Or visit directly:                     │
│  https://your-domain.com/register       │
│                                         │
│  [Phone Icon] Scan with your smartphone │
│                                         │
└─────────────────────────────────────────┘
```

### Colors

- **Background**: Gradient from primary/10 to accent/10
- **Card**: White with shadow
- **QR Code**: Black on white
- **Text**: Foreground color (dark blue)
- **Accents**: Primary color (blue)

### Typography

- **Title**: 5xl (3rem) - "Event Registration"
- **Subtitle**: 2xl (1.5rem) - "Scan to Register..."
- **Instructions**: xl (1.25rem) - Step descriptions
- **URL**: xl (1.25rem) - Monospace font

## Best Practices

### Before Event

- ✅ Test QR code scanning with multiple devices
- ✅ Verify registration page loads correctly
- ✅ Check projector display quality
- ✅ Prepare backup plan (manual URL)
- ✅ Test in actual event venue if possible

### During Event

- ✅ Keep page open and visible
- ✅ Monitor for technical issues
- ✅ Have backup device ready
- ✅ Assist participants as needed
- ✅ Track registration progress

### After Event

- ✅ Close the QR page
- ✅ Review registration data
- ✅ Note any issues for next time
- ✅ Gather feedback from participants

## Accessibility

### Visual Accessibility

- High contrast QR code (black on white)
- Large text for easy reading
- Clear visual hierarchy
- Professional, clean design

### Alternative Access

- Manual URL provided below QR code
- URL can be typed manually
- Registration page is mobile-friendly
- Works on all modern browsers

## Technical Requirements

### Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Any modern browser with JavaScript enabled

### Device Requirements

**Display Device:**
- Computer/laptop with browser
- Projector or large screen
- Stable internet connection

**Participant Devices:**
- Smartphone with camera
- QR code scanning capability (built into most modern phones)
- Internet connection (WiFi or mobile data)

## Integration

### Related Pages

- **Registration Page**: `/register` - Where QR code redirects
- **Admin Participants**: `/participants` - Monitor registrations
- **Dashboard**: `/` - View statistics

### Workflow

```
Event Setup
    ↓
Display /register-qr on projector
    ↓
Participants scan QR code
    ↓
Redirects to /register
    ↓
Participants fill form
    ↓
Data saved to database
    ↓
Admin monitors at /participants
```

## Customization

### Changing QR Code Size

Edit `app/register-qr/page.tsx`:

```typescript
<QRCodeSVG
  size={500}  // Change from 400 to 500 for larger QR code
  // ... other props
/>
```

### Changing Colors

Edit the QR code colors:

```typescript
<QRCodeSVG
  bgColor="#f0f0f0"  // Light gray background
  fgColor="#003A70"  // Dark blue foreground
  // ... other props
/>
```

### Changing Text

Edit the text content in the JSX:

```typescript
<h1 className="text-5xl font-bold mb-4 text-foreground">
  Your Custom Title
</h1>
```

## Troubleshooting

### QR Code Not Displaying

**Issue**: QR code shows "Loading..."
- **Cause**: JavaScript not loaded or error
- **Solution**: Refresh page, check browser console

### QR Code Scans to Wrong URL

**Issue**: QR code redirects to incorrect page
- **Cause**: URL generation issue
- **Solution**: Check `window.location.origin` value

### Page Layout Broken

**Issue**: Elements not displaying correctly
- **Cause**: CSS not loaded or browser compatibility
- **Solution**: Clear cache, try different browser

### Projector Display Issues

**Issue**: QR code not visible on projector
- **Cause**: Low brightness, poor contrast, resolution
- **Solution**: Adjust projector settings, increase brightness

## Security Considerations

### Public Access

- Page is publicly accessible (no authentication)
- QR code points to public registration page
- No sensitive data displayed
- Safe to display in public venues

### URL Validation

- URL is generated client-side from `window.location.origin`
- Always points to same domain
- No external redirects
- Safe from URL manipulation

## Performance

### Load Time

- Fast loading (minimal dependencies)
- QR code generated client-side
- No external API calls
- Instant QR code generation

### Resource Usage

- Low CPU usage
- Minimal memory footprint
- No continuous updates
- Static page after initial load

## Future Enhancements

### Potential Additions

1. **Live Registration Counter**
   - Show number of registrations in real-time
   - Update automatically as people register

2. **Multiple QR Codes**
   - Different QR codes for different departments
   - Pre-filled department selection

3. **Animated Elements**
   - Subtle animations to attract attention
   - Pulsing QR code border

4. **Event Branding**
   - Custom logo display
   - Event-specific colors and text
   - Company branding

5. **QR Code Download**
   - Button to download QR code as image
   - For printing on posters/flyers

6. **Analytics**
   - Track QR code scans
   - Monitor registration sources

## Related Files

- `app/register-qr/page.tsx` - QR code display page
- `app/register/page.tsx` - Registration page (QR destination)
- `lib/constants.ts` - Department list
- `package.json` - Dependencies (qrcode.react)

## Support

### For Event Organizers

If you encounter issues:
1. Refresh the page
2. Check internet connection
3. Test QR code with your phone
4. Have manual URL ready as backup
5. Contact technical support if needed

### For Participants

If QR code won't scan:
1. Try moving closer/farther
2. Ensure good lighting
3. Use manual URL below QR code
4. Ask event organizer for help

