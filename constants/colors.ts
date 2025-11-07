/**
 * Centralized color palette for the application
 * All colors used in the app should reference these constants
 */

export const Colors = {
  // Background colors
  background: {
    primary: "#ededed",
    secondary: "#d0d0d0",
    white: "#fff",
    black: "#000",
  },

  // Text colors
  text: {
    primary: "#000",
    secondary: "#00000080", // 50% opacity
    placeholder: "#00000080",
  },

  // Border colors
  border: {
    light: "#0000000d", // Very light border
    medium: "#d0d0d0",
    dark: "#000",
  },

  // Icon colors
  icon: {
    primary: "#000",
    secondary: "rgba(0, 0, 0, 0.05)",
  },

  // Status colors
  status: {
    error: "#ff0000",
    success: "#00ff00",
    warning: "#ffaa00",
  },
} as const;
