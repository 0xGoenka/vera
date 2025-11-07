/**
 * Spacing constants for consistent layout
 * All spacing values should reference these constants
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Common padding values
 */
export const Padding = {
  container: 10,
  input: 10,
  inputLeft: 25,
  header: 16,
  headerHorizontal: 20,
  collapsible: 12,
  collapsibleHorizontal: 20,
  content: 16,
  contentHorizontal: 20,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Common margin values
 */
export const Margin = {
  text: 12,
  welcomeText: 20,
  collapsible: 8,
  collapsibleHorizontal: 4,
} as const;

/**
 * Border radius values
 */
export const BorderRadius = {
  small: 3,
  medium: 10,
  large: 25,
  xlarge: 28,
  round: 50,
} as const;

/**
 * Common dimensions
 */
export const Dimensions = {
  iconSize: 18,
  iconContainer: 32,
  inputHeight: 40,
  headerHeight: 50,
  progressBarHeight: 6,
  footerHeight: 100,
} as const;
