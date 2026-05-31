/**
 * Advanced regex-based extraction utilities for emails and phone numbers.
 *
 * Supports:
 * - International formats with country codes
 * - African phone numbers (all 54 countries with +20x–+26x codes)
 * - North American numbers with extensions (ext, x, extension, poste, #, etc.)
 * - Local zero-prefixed numbers (077 123 45 67, 06 12 34 56 78)
 * - Multiple separator styles (spaces, dashes, dots, parentheses, nothing)
 * - Deduplication, sanitization, and false-positive filtering
 *
 * Strategy: Process text LINE BY LINE to prevent cross-line matching,
 * then combine all results and deduplicate.
 */

// ─── EMAIL EXTRACTION ────────────────────────────────────────────────

/**
 * Email regex pattern supporting:
 * - Standard emails (user@domain.com)
 * - Plus addressing (user+tag@gmail.com)
 * - Subdomains (user@mail.corporate.co.uk)
 * - Modern TLDs (.tech, .design, .photography)
 * - Business domains
 */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// ─── PHONE EXTRACTION ────────────────────────────────────────────────

/**
 * Extension suffix pattern — captures extensions after a phone number.
 * Supports: ext, ext., x, extension, poste, post, p, #, followed by digits.
 * Examples: "ext 1234", "x567", "extension 89", "poste 123", "#456"
 */
const EXTENSION_PATTERN = `(?:\\s*(?:ext|ext\\.|x|extension|poste|post|p|\\#)\\.?\\s*\\d{1,8})?`;

/**
 * Separator class for phone number digit groups.
 * IMPORTANT: We use [\\s\\-.] (space, dash, dot) but NOT newline.
 * This prevents cross-line matching.
 */
const SEP = `[\\s\\-.]`;

/**
 * Digit group with optional single separator — compact notation.
 * Matches "12", "1-2", "1.2", "1 2" but not "1\n2"
 */
const DSEP = `(?:${SEP}?\\d)`;

/**
 * Pattern 1: International format with country code.
 * The country code part (+XXX) is optional, but when present, it anchors the match.
 * Matches: +221 77 123 45 67, +1 (415) 555-2671, +44 20 7946 0958
 *          +213 5 55 12 34 56, +212 6 12 34 56 78, +20 100 234 5678
 */
const PATTERN_INTERNATIONAL =
  `(?:\\+\\d{1,4}${SEP}?\\s*\\(?)?\\(?\\d{1,5}\\)?${SEP}?\\d${DSEP}{4,14}`;

/**
 * Pattern 2: North American format with area code in parentheses.
 * Matches: (212) 555-9999, (415) 555-4242, (800) 123-4567 ext 89
 */
const PATTERN_NA_PAREN =
  `\\(\\d{3}\\)\\s*\\d{3}${SEP}\\d{4}`;

/**
 * Pattern 3: North American format with dashes/dots/spaces.
 * Matches: 415-555-4242, 415.555.4242, 415 555 4242
 */
const PATTERN_NA_DASH =
  `\\d{3}${SEP}\\d{3}${SEP}\\d{4}`;

/**
 * Pattern 4: African numbers — explicit country code pattern.
 * Covers all African country codes (+20 through +269).
 * African numbers typically have 7-12 digits after the country code,
 * often grouped as 2-2-2-2, 3-3-3, or 1-2-2-2-2.
 */
const PATTERN_AFRICAN =
  `(?:\\+(?:20|27|2[0-6]\\d))[\\s\\-.]?\\(?\\d(?:${SEP}?\\d){5,14}`;

/**
 * Pattern 5: Plain digit sequences that look like phone numbers.
 * Matches: 0612345678, 0771234567, 08012345678 (10-15 digits)
 * Must not be a year or version number.
 */
const PATTERN_PLAIN_DIGITS =
  `\\d{10,15}`;

/**
 * Pattern 6: Local numbers starting with 0 followed by separators.
 * Common in Africa and Europe where local format starts with 0.
 * Matches: 077 123 45 67, 06 12 34 56 78, 05 55 12 34 56
 * Must start with 0 and contain at least 7 more digits.
 */
const PATTERN_LOCAL_ZERO =
  `0\\d(?:${SEP}?\\d){6,14}`;

/**
 * Combined phone regex for a SINGLE LINE.
 * Joins all patterns with the extension suffix.
 * Uses non-capturing groups and the global flag.
 */
const PHONE_REGEX_LINE = new RegExp(
  `(?:${PATTERN_INTERNATIONAL}|${PATTERN_NA_PAREN}|${PATTERN_NA_DASH}|${PATTERN_AFRICAN}|${PATTERN_LOCAL_ZERO}|${PATTERN_PLAIN_DIGITS})${EXTENSION_PATTERN}`,
  "g"
);

// ─── VALIDATION ──────────────────────────────────────────────────────

/**
 * Known false-positive patterns to exclude.
 * These look like phone numbers but aren't.
 */
const FALSE_POSITIVE_PATTERNS = [
  /^\d+\.\d+(\.\d+)+$/,                  // Version numbers: 1.0.0, 2.3.14
  /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/, // Dates: 12/25/2024, 01-15-24
  /^(19|20)\d{2}$/,                       // Years: 2024, 1999
  /^\d{1,3}$/,                            // Too short: 42, 100
  /^0+$/,                                 // All zeros
  /^(\d)\1{6,}$/,                         // Repeated digits: 1111111
  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // IP addresses: 192.168.1.1
];

/**
 * African country codes for special validation.
 * Numbers starting with these codes get more lenient validation
 * since they have diverse digit lengths.
 */
const AFRICAN_COUNTRY_CODES = [
  "+20", "+27",
  "+210", "+211", "+212", "+213", "+214", "+215", "+216", "+217",
  "+218", "+219",
  "+220", "+221", "+222", "+223", "+224", "+225", "+226", "+227",
  "+228", "+229",
  "+230", "+231", "+232", "+233", "+234", "+235", "+236", "+237",
  "+238", "+239",
  "+240", "+241", "+242", "+243", "+244", "+245", "+246", "+247",
  "+248", "+249",
  "+250", "+251", "+252", "+253", "+254", "+255", "+256", "+257",
  "+258", "+259",
  "+260", "+261", "+262", "+263", "+264", "+265", "+266", "+267",
  "+268", "+269",
];

/**
 * Checks if a phone number string starts with an African country code.
 *
 * @param phone - The phone number string
 * @returns Whether it starts with an African country code
 */
function isAfricanNumber(phone: string): boolean {
  const trimmed = phone.trim().replace(/\s+/g, "");
  return AFRICAN_COUNTRY_CODES.some((code) => trimmed.startsWith(code));
}

/**
 * Checks if a phone number has an extension suffix.
 *
 * @param phone - The phone number string
 * @returns Whether an extension is present
 */
function hasExtension(phone: string): boolean {
  return /\b(?:ext|ext\.|x|extension|poste|post|p|#)\.?\s*\d{1,8}\s*$/i.test(phone);
}

/**
 * Extracts the base phone number (without extension) and the extension separately.
 *
 * @param phone - The phone number string potentially with extension
 * @returns Object with base and extension parts
 */
function parseExtension(phone: string): { base: string; extension: string | null } {
  const match = phone.match(/^(.+?)\s+(?:ext|ext\.|x|extension|poste|post|p|#)\.?\s*(\d{1,8})\s*$/i);
  if (match) {
    return { base: match[1].trim(), extension: match[2] };
  }
  return { base: phone.trim(), extension: null };
}

/**
 * Validates whether a string is a legitimate phone number.
 * More lenient for African numbers, supports extensions.
 * Filters out false positives like version numbers, dates, IP addresses.
 *
 * @param phone - The candidate phone number string
 * @returns Whether the string is a valid phone number
 */
function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;

  // Check against known false-positive patterns
  for (const pattern of FALSE_POSITIVE_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  // Extract digits (excluding extension digits for length check)
  const { base, extension } = parseExtension(trimmed);

  // Count digits in the base number
  const baseDigits = base.replace(/\D/g, "");

  // If there's an extension, the base can be shorter
  const minDigits = extension ? 6 : 7;

  // Phone numbers: 6-15 digits in base (E.164 max 15)
  if (baseDigits.length < minDigits || baseDigits.length > 15) {
    return false;
  }

  // Must contain at least some digit diversity (not all same digit)
  const uniqueDigits = new Set(baseDigits.split(""));
  if (uniqueDigits.size === 1 && baseDigits.length > 4) {
    // Allow if it has an extension or starts with country code
    if (!extension && !trimmed.startsWith("+")) return false;
  }

  return true;
}

/**
 * Sanitizes and normalizes a phone number string.
 * Preserves international format, extensions, and cleans up whitespace.
 *
 * @param phone - The raw phone number string
 * @returns Cleaned and normalized phone number
 */
function sanitizePhone(phone: string): string {
  return phone
    .trim()
    .replace(/\s+/g, " ")           // Normalize multiple spaces to single space
    .replace(/\.\./g, ".")          // Remove double dots
    .replace(/--/g, "-")            // Remove double dashes
    .replace(/\(\s+/g, "(")         // Remove space after opening paren
    .replace(/\s+\)/g, ")")         // Remove space before closing paren
    .replace(/\(\)/g, "")           // Remove empty parentheses
    .replace(/\s+ext\s+/gi, " ext ")       // Normalize extension keyword
    .replace(/\s+extension\s+/gi, " ext ") // Normalize extension keyword
    .replace(/\s+poste\s+/gi, " ext ")     // Normalize poste to ext
    .replace(/\s+post\s+/gi, " ext ")      // Normalize post to ext
    // Ensure consistent spacing for extension markers
    .replace(/ext\.?\s*(\d)/gi, "ext $1")
    .replace(/\s+x\s*(\d)/gi, " x$1")
    .replace(/\s+#\s*(\d)/gi, " #$1");
}

/**
 * Validates whether a string is a legitimate email address.
 *
 * @param email - The candidate email string
 * @returns Whether the string is a valid email
 */
function isValidEmail(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  if (!local || local.length === 0) return false;
  if (!domain || domain.length === 0) return false;
  if (!domain.includes(".")) return false;

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

  const sanitized = matches.map(sanitizeEmail).filter(isValidEmail);
  return [...new Set(sanitized)];
}

/**
 * Normalizes a phone number to its digit-only form for deduplication.
 * Includes extension digits appended after "ext" marker.
 *
 * @param phone - The phone number string
 * @returns Normalized digit string for comparison
 */
function normalizeForDedup(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Extracts all phone numbers from a given text string.
 * Processes text LINE BY LINE to prevent cross-line matching.
 * Handles extensions, African numbers, and international formats.
 * Removes duplicates and validates each phone number.
 *
 * @param text - The raw text to extract phone numbers from
 * @returns Array of unique, validated phone numbers
 */
export function extractPhones(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  // Process each line separately to prevent cross-line matching
  const lines = text.split(/\n/);
  const allMatches: string[] = [];

  for (const line of lines) {
    const matches = line.match(PHONE_REGEX_LINE);
    if (matches) {
      allMatches.push(...matches);
    }
  }

  if (allMatches.length === 0) return [];

  // Sanitize, validate, and deduplicate
  const seen = new Set<string>();
  const results: string[] = [];

  for (const raw of allMatches) {
    const sanitized = sanitizePhone(raw);
    if (!isValidPhone(sanitized)) continue;

    const normalized = normalizeForDedup(sanitized);
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    results.push(sanitized);
  }

  return results;
}

/**
 * Extracts both emails and phone numbers from a given text string.
 *
 * @param text - The raw text to extract contacts from
 * @returns Object containing emails and phones arrays
 */
export function extractContacts(text: string): {
  emails: string[];
  phones: string[];
} {
  const emails = extractEmails(text);
  const phones = extractPhones(text);

  return { emails, phones };
}
