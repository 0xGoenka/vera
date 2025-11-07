/**
 * Shifts the first n characters from a string
 * @param n - Number of characters to shift
 * @param str - The string to shift from
 * @returns Object with shifted characters and remaining string
 */
export function shiftChars(
  n: number,
  str: string
): { shifted: string; remaining: string } {
  if (n <= 0 || str.length === 0) {
    return { shifted: "", remaining: str };
  }

  const shifted = str.slice(0, Math.min(n, str.length));
  const remaining = str.slice(shifted.length);
  return { shifted, remaining };
}
