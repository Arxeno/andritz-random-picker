# Application Configuration Guide

## Overview

All application constants and configuration values are centralized in `lib/config.ts`. This makes it easy to adjust settings without searching through multiple files.

## Configuration File Location

```
lib/config.ts
```

## Available Configurations

### 1. Wheel Configuration (`WHEEL_CONFIG`)

Controls the behavior and appearance of the spinning wheel.

#### `SPIN_DURATION`
- **Type**: `number` (milliseconds)
- **Default**: `30000` (30 seconds)
- **Description**: Duration of the wheel spin animation
- **Usage**: Controls how long the wheel spins before stopping on a winner

```typescript
WHEEL_CONFIG.SPIN_DURATION = 30000; // 30 seconds
```

#### `FULL_ROTATIONS`
- **Type**: `number`
- **Default**: `5`
- **Description**: Number of full rotations the wheel makes during spin
- **Usage**: More rotations = more dramatic effect

```typescript
WHEEL_CONFIG.FULL_ROTATIONS = 5; // 5 complete spins
```

#### `COLORS`
- **Type**: `string[]` (hex colors)
- **Default**: 8 alternating colors
- **Description**: Colors used for wheel segments
- **Usage**: Automatically cycles through colors for visual distinction

```typescript
WHEEL_CONFIG.COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
];
```

### 2. Animation Configuration (`ANIMATION_CONFIG`)

Controls confetti and other animations.

#### `CONFETTI_DURATION`
- **Type**: `number` (milliseconds)
- **Default**: `5000` (5 seconds)
- **Description**: How long confetti animation plays
- **Usage**: Duration of celebration effect after winner selection

```typescript
ANIMATION_CONFIG.CONFETTI_DURATION = 5000; // 5 seconds
```

#### `CONFETTI_PARTICLE_COUNT`
- **Type**: `number`
- **Default**: `200`
- **Description**: Number of confetti particles
- **Usage**: More particles = more dramatic celebration (but may impact performance)

```typescript
ANIMATION_CONFIG.CONFETTI_PARTICLE_COUNT = 200;
```

### 3. UI Configuration (`UI_CONFIG`)

Controls user interface display settings.

#### `MAX_NAME_LENGTH_ON_WHEEL`
- **Type**: `number`
- **Default**: `15`
- **Description**: Maximum character length for names displayed on wheel
- **Usage**: Names longer than this will be truncated

```typescript
UI_CONFIG.MAX_NAME_LENGTH_ON_WHEEL = 15;
```

#### `TRUNCATED_NAME_LENGTH`
- **Type**: `number`
- **Default**: `12`
- **Description**: Length to truncate names to (before adding "...")
- **Usage**: Long names become "FirstName..." on the wheel

```typescript
UI_CONFIG.TRUNCATED_NAME_LENGTH = 12;
// Example: "Christopher Anderson" → "Christopher..."
```

### 4. Prize Configuration (`PRIZE_CONFIG`)

Controls prize image upload settings.

#### `MAX_IMAGE_SIZE`
- **Type**: `number` (bytes)
- **Default**: `5242880` (5MB)
- **Description**: Maximum file size for prize images
- **Usage**: Prevents uploading excessively large images

```typescript
PRIZE_CONFIG.MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
```

#### `ALLOWED_IMAGE_TYPES`
- **Type**: `string[]` (MIME types)
- **Default**: `["image/jpeg", "image/png", "image/gif", "image/webp"]`
- **Description**: Allowed image file types for prizes
- **Usage**: Restricts uploads to supported image formats

```typescript
PRIZE_CONFIG.ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];
```

## How to Use

### Importing Configuration

```typescript
// Import specific config sections
import { WHEEL_CONFIG, ANIMATION_CONFIG } from "@/lib/config";

// Or import all configs
import { APP_CONFIG } from "@/lib/config";
```

### Using in Components

```typescript
// Example: Using wheel spin duration
const duration = WHEEL_CONFIG.SPIN_DURATION;

// Example: Using wheel colors
const colors = WHEEL_CONFIG.COLORS;

// Example: Using max name length
if (name.length > UI_CONFIG.MAX_NAME_LENGTH_ON_WHEEL) {
  name = name.substring(0, UI_CONFIG.TRUNCATED_NAME_LENGTH) + "...";
}
```

## Files Using Configuration

### `components/wheel.tsx`
- Uses `WHEEL_CONFIG.SPIN_DURATION` for animation duration
- Uses `WHEEL_CONFIG.FULL_ROTATIONS` for rotation count
- Uses `WHEEL_CONFIG.COLORS` for segment colors
- Uses `UI_CONFIG.MAX_NAME_LENGTH_ON_WHEEL` for name truncation
- Uses `UI_CONFIG.TRUNCATED_NAME_LENGTH` for truncation length

### `app/dummy-spin/page.tsx`
- Uses `WHEEL_CONFIG.SPIN_DURATION` for spin timeout

## Customization Examples

### Change Spin Duration to 15 Seconds

Edit `lib/config.ts`:
```typescript
export const WHEEL_CONFIG = {
  SPIN_DURATION: 15000, // Changed from 30000 to 15000
  // ... rest of config
};
```

### Add More Wheel Colors

Edit `lib/config.ts`:
```typescript
export const WHEEL_CONFIG = {
  COLORS: [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
    "#FF69B4", // Hot Pink (NEW)
    "#32CD32", // Lime Green (NEW)
  ],
  // ... rest of config
};
```

### Increase Confetti Particles

Edit `lib/config.ts`:
```typescript
export const ANIMATION_CONFIG = {
  CONFETTI_DURATION: 5000,
  CONFETTI_PARTICLE_COUNT: 500, // Changed from 200 to 500
};
```

### Allow Longer Names on Wheel

Edit `lib/config.ts`:
```typescript
export const UI_CONFIG = {
  MAX_NAME_LENGTH_ON_WHEEL: 20, // Changed from 15 to 20
  TRUNCATED_NAME_LENGTH: 17,    // Changed from 12 to 17
};
```

## Best Practices

1. **Always use config values** instead of hardcoding constants in components
2. **Document changes** when modifying config values
3. **Test thoroughly** after changing configuration values
4. **Consider performance** when increasing particle counts or animation durations
5. **Maintain consistency** by using the same config across all components

## Type Safety

All configuration objects are marked with `as const` to ensure type safety:

```typescript
export const WHEEL_CONFIG = {
  SPIN_DURATION: 30000,
  // ...
} as const;
```

This prevents accidental modification and provides better TypeScript autocomplete.

## Future Additions

When adding new configuration values:

1. Add them to the appropriate config section in `lib/config.ts`
2. Add JSDoc comments for documentation
3. Update this documentation file
4. Update components to use the new config values
5. Test the changes thoroughly

## Related Documentation

- [Blue Theme Colors](./BLUE_THEME_COLORS.md) - Theme color configuration
- [Tailwind V4 Migration](./TAILWIND_V4_MIGRATION.md) - Styling configuration

