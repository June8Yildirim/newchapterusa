/** Lightweight, dependency-free form validation helpers shared across forms. */

/** True when `value` looks like a valid email address (non-empty, has one @, a domain, and a TLD). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** True when a required text field has non-whitespace content. */
export function isFilled(value: string): boolean {
  return value.trim() !== "";
}
