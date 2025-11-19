# Blue Theme Color Palette

## Color Palette

The application uses a custom blue color palette with the following colors:

| Color Name | Hex Code | HSL | Usage |
|------------|----------|-----|-------|
| **Very Light Blue** | `#BFDCEF` | `hsl(203 63% 84%)` | Secondary backgrounds, borders |
| **Light Blue** | `#7FBADE` | `hsl(200 54% 68%)` | Accents, hover states |
| **Blue** | `#4098CE` | `hsl(200 54% 53%)` | Muted foreground, secondary text |
| **Light Dark Blue** | `#0075BE` | `hsl(200 100% 37%)` | Primary buttons, links, focus rings |
| **Dark Blue** | `#003A70` | `hsl(207 100% 22%)` | Text, headings, dark elements |

## Color Swatches

```
#BFDCEF ████████  Very Light Blue
#7FBADE ████████  Light Blue
#4098CE ████████  Blue
#0075BE ████████  Light Dark Blue
#003A70 ████████  Dark Blue
```

## Theme Mapping

### Light Mode

| UI Element | Color Used | Hex | Purpose |
|------------|------------|-----|---------|
| Background | White | `#FFFFFF` | Main page background |
| Foreground (Text) | Dark Blue | `#003A70` | Primary text color |
| Primary | Light Dark Blue | `#0075BE` | Buttons, links, CTAs |
| Primary Foreground | White | `#FFFFFF` | Text on primary buttons |
| Secondary | Very Light Blue | `#BFDCEF` | Secondary buttons, badges |
| Secondary Foreground | Dark Blue | `#003A70` | Text on secondary elements |
| Muted | Very Light Blue (lighter) | `hsl(203 63% 94%)` | Disabled states, subtle backgrounds |
| Muted Foreground | Blue | `#4098CE` | Secondary text, descriptions |
| Accent | Light Blue | `#7FBADE` | Highlights, hover states |
| Accent Foreground | White | `#FFFFFF` | Text on accent elements |
| Border | Very Light Blue (light) | `hsl(203 63% 90%)` | Borders, dividers |
| Input | Very Light Blue (light) | `hsl(203 63% 90%)` | Input borders |
| Ring | Light Dark Blue | `#0075BE` | Focus rings |

### Dark Mode

| UI Element | Color Used | Hex/HSL | Purpose |
|------------|------------|---------|---------|
| Background | Very Dark Blue | `hsl(207 100% 10%)` | Main page background |
| Foreground (Text) | Very Light Blue | `#BFDCEF` | Primary text color |
| Primary | Light Blue | `#7FBADE` | Buttons, links, CTAs |
| Primary Foreground | Dark Blue | `#003A70` | Text on primary buttons |
| Secondary | Dark Blue | `#003A70` | Secondary buttons, badges |
| Secondary Foreground | Very Light Blue | `#BFDCEF` | Text on secondary elements |
| Muted | Dark Blue (lighter) | `hsl(207 100% 18%)` | Disabled states, subtle backgrounds |
| Muted Foreground | Light Blue | `#7FBADE` | Secondary text, descriptions |
| Accent | Light Dark Blue | `#0075BE` | Highlights, hover states |
| Accent Foreground | White | `#FFFFFF` | Text on accent elements |
| Border | Dark Blue (lighter) | `hsl(207 100% 20%)` | Borders, dividers |
| Input | Dark Blue (lighter) | `hsl(207 100% 20%)` | Input borders |
| Ring | Light Blue | `#7FBADE` | Focus rings |

## Usage Examples

### Primary Button
```tsx
<Button>Click Me</Button>
// Background: #0075BE (Light Dark Blue)
// Text: White
```

### Secondary Button
```tsx
<Button variant="secondary">Cancel</Button>
// Background: #BFDCEF (Very Light Blue)
// Text: #003A70 (Dark Blue)
```

### Accent/Hover States
```tsx
<div className="hover:bg-accent">
// Hover Background: #7FBADE (Light Blue)
</div>
```

### Text Colors
```tsx
<h1 className="text-foreground">Heading</h1>
// Color: #003A70 (Dark Blue)

<p className="text-muted-foreground">Description</p>
// Color: #4098CE (Blue)
```

### Borders
```tsx
<div className="border">
// Border Color: hsl(203 63% 90%) (Light version of Very Light Blue)
</div>
```

## Color Accessibility

### Contrast Ratios (Light Mode)

- **Dark Blue (#003A70) on White**: 11.5:1 ✅ AAA
- **Light Dark Blue (#0075BE) on White**: 4.6:1 ✅ AA
- **Blue (#4098CE) on White**: 3.2:1 ⚠️ AA Large Text
- **White on Light Dark Blue (#0075BE)**: 4.6:1 ✅ AA
- **Dark Blue (#003A70) on Very Light Blue (#BFDCEF)**: 7.8:1 ✅ AAA

### Contrast Ratios (Dark Mode)

- **Very Light Blue (#BFDCEF) on Very Dark Blue**: 10.2:1 ✅ AAA
- **Light Blue (#7FBADE) on Very Dark Blue**: 6.8:1 ✅ AA
- **Dark Blue (#003A70) on Light Blue (#7FBADE)**: 5.2:1 ✅ AA

## Implementation

The theme is implemented in `app/globals.css` using Tailwind CSS v4's `@theme` directive:

```css
@theme {
  --color-primary: hsl(200 100% 37%); /* #0075BE */
  --color-secondary: hsl(203 63% 84%); /* #BFDCEF */
  --color-accent: hsl(200 54% 68%); /* #7FBADE */
  /* ... more colors */
}
```

## Customization

To modify the theme colors:

1. Edit `app/globals.css`
2. Update the HSL values in the `@theme` block
3. The changes will apply automatically to all shadcn/ui components

## Color Conversion Reference

If you need to convert between color formats:

- **Hex to HSL**: Use online tools or CSS color functions
- **HSL Format**: `hsl(hue saturation% lightness%)`
  - Hue: 0-360 (color wheel position)
  - Saturation: 0-100% (color intensity)
  - Lightness: 0-100% (brightness)

## Brand Consistency

This blue palette creates a professional, trustworthy appearance suitable for:
- Corporate applications
- Business tools
- Professional dashboards
- Enterprise software

The color scheme maintains:
- ✅ High contrast for readability
- ✅ Consistent visual hierarchy
- ✅ Professional appearance
- ✅ Accessibility standards (WCAG AA/AAA)

