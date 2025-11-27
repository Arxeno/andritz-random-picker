/**
 * Application Configuration
 * Centralized configuration file for all application constants
 */

/**
 * Wheel Spin Configuration
 */
export const WHEEL_CONFIG = {
  /**
   * Duration of the wheel spin animation in milliseconds
   * @default 10000 (10 seconds)
   */
  SPIN_DURATION: 10000,

  /**
   * Number of full rotations the wheel makes during spin
   * @default 5
   */
  FULL_ROTATIONS: 10,

  /**
   * Wheel colors - alternating for visual distinction
   */
  COLORS: [
    // "#FF6B6B", // Red
    // "#4ECDC4", // Teal
    // "#45B7D1", // Blue
    // "#FFA07A", // Light Salmon
    // "#98D8C8", // Mint
    // "#F7DC6F", // Yellow
    // "#BB8FCE", // Purple
    // "#85C1E2", // Sky Blue
    "#FFFFFF", // White
    // "#BFDCEF", // Light Blue
    "#003A70", // Dark Blue
  ],

  FONT_COLORS: [
    "#003A70",
    // "#003A70",
    "#FFFFFF",
  ],
} as const;

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  /**
   * Confetti animation duration in milliseconds
   * @default 5000 (5 seconds)
   */
  CONFETTI_DURATION: 5000,

  /**
   * Confetti particle count
   * @default 200
   */
  CONFETTI_PARTICLE_COUNT: 200,
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  /**
   * Maximum length for participant names displayed on wheel
   * @default 15
   */
  MAX_NAME_LENGTH_ON_WHEEL: 15,

  /**
   * Truncated name length (before adding "...")
   * @default 12
   */
  TRUNCATED_NAME_LENGTH: 12,
} as const;

/**
 * Prize Configuration
 */
export const PRIZE_CONFIG = {
  /**
   * Maximum file size for prize images in bytes
   * @default 5242880 (5MB)
   */
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB

  /**
   * Allowed image file types
   */
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
} as const;

/**
 * Export all configs as a single object
 */
export const APP_CONFIG = {
  WHEEL: WHEEL_CONFIG,
  ANIMATION: ANIMATION_CONFIG,
  UI: UI_CONFIG,
  PRIZE: PRIZE_CONFIG,
} as const;
