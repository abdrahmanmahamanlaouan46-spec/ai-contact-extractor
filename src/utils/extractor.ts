/**
 * Advanced regex-based extraction utilities for emails and phone numbers.
 * Supports international formats, deduplication, and sanitization.
 */

/**
 * Email regex pattern supporting:
 * - Standard emails (user@domain.com)
 * - Plus addressing (user+tag@gmail.com)
 * - Subdomains (user@mail.corporate.co.uk)
 * - Modern TLDs (.tech, .design, .photography)
 * - Business domains
 */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

/**
 * Phone regex pattern supporting:
 * - International format with country code (+1, +44, +221, etc.)
 * - Parentheses area codes: (212) 555-9999
 * - Dashes: 415-555-4242
 * - Dots: 415.555.4242
 * - Spaces: +221 77 123 45 67
 * - Plain digits: 2125559999
 * - Mixed formats
 */
const PHONE_REGEX =
  /(?:\+?\d{1,4}[\s\-.]?)?\(?\d{1,4}\)?[\s\-.]?\d{1,4}[\s\-.]?\d{1,4}[\s\-.]?\d{0,4}[\s\-.]?\d{0,4}/g;

/**
 * Validates whether a string is a legitimate phone number.
 * Filters out false positives like version numbers, dates, etc.
 *
 * @param phone - The candidate phone number string
 * @returns Whether the string is a valid phone number
 */
function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, "");

  // A valid phone number should have between 7 and 15 digits (ITU-T E.164)
  if (digits.length < 7 || digits.length > 15) return false;

  // Must not be a year (4 consecutive digits starting with 19 or 20)
  if (/^(19|20)\d{2}$/.test(digits)) return false;

  // Must not be a version number pattern (e.g., "1.0.0")
  if (/^\d+\.\d+(\.\d+)*$/.test(phone.trim())) return false;

  // Must not be a date pattern (e.g., "12/25/2024")
  if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(phone.trim())) return false;

  return true;
}

/**
 * Sanitizes and normalizes a phone number string.
 * Preserves international format while cleaning up whitespace.
 *
 * @param phone - The raw phone number string
 * @returns Cleaned and normalized phone number
 */
function sanitizePhone(phone: string): string {
  return phone
    .trim()
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .replace(/\.\./g, ".") // Remove double dots
    .replace(/--/g, "-"); // Remove double dashes
}

/**
 * Validates whether a string is a legitimate email address.
 *
 * @param email - The candidate email string
 * @returns Whether the string is a valid email
 */
function isValidEmail(email: string): boolean {
  // Basic structural checks
  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // Local part should not be empty
  if (!local || local.length === 0) return false;

  // Domain should have at least one dot and valid TLD
  if (!domain || domain.length === 0) return false;

  // Domain must contain at least one dot
  if (!domain.includes(".")) return false;

  // TLD should be at least 2 characters
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return false;

  return true;
}

/**
 * Sanitizes an email address by trimming and lowercasing.
 *
 * @param email - The raw email string
 * @returns Cleaned email address
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Extracts all email addresses from a given text string.
 * Removes duplicates and validates each email.
 *
 * @param text - The raw text to extract emails from
 * @returns Array of unique, validated email addresses
 */
export function extractEmails(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  const matches = text.match(EMAIL_REGEX);
  if (!matches) return [];

  // Sanitize, validate, and deduplicate
  const sanitized = matches.map(sanitizeEmail).filter(isValidEmail);
  return [...new Set(sanitized)];
}

/**
 * Extracts all phone numbers from a given text string.
 * Removes duplicates and validates each phone number.
 *
 * @param text - The raw text to extract phone numbers from
 * @returns Array of unique, validated phone numbers
 */
export function extractPhones(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  const matches = text.match(PHONE_REGEX);
  if (!matches) return [];

  // Sanitize, validate, and deduplicate
  const sanitized = matches.map(sanitizePhone).filter(isValidPhone);
  return [...new Set(sanitized)];
}

/**
 * Extracts both emails and phone numbers from a given text string.
 * Combines the results into a single extraction result object.
 *
 * @param text - The raw text to extract contacts from
 * @returns ExtractionResult containing emails, phones, and total count
 */
export function extractContacts(text: string): {
  emails: string[];
  phones: string[];
} {
  const emails = extractEmails(text);
  const phones = extractPhones(text);

  return { emails, phones };
}
