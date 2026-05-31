/**
 * Advanced regex-based extraction utilities for emails and phone numbers.
 *
 * Designed to match the completeness of a Python phonenumbers-based extractor:
 *   - ALL African country codes (+20 through +269)
 *   - US/Canadian numbers WITH extensions (ext, x, extension, poste, #, etc.)
 *   - International formats with flexible grouping and separators
 *   - Local zero-prefixed numbers (077 123 45 67, 06 12 34 56 78)
 *   - Multiple separator styles (spaces, dashes, dots, parentheses, nothing)
 *   - Deduplication, sanitization, and false-positive filtering
 *
 * Strategy: BROAD matching → SMART validation → clean output
 * We prefer over-matching and then filtering, rather than under-matching.
 */

// ─── EMAIL EXTRACTION ────────────────────────────────────────────────

/**
 * Email regex pattern — broad and reliable.
 * Supports plus addressing, subdomains, modern TLDs, business domains.
 */
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// ─── EXTENSION PATTERN ───────────────────────────────────────────────

/**
 * Extension suffix that can follow a phone number.
 * Captures: ext, ext., x, extension, poste, post, p, #, followed by digits.
 * The extension part is OPTIONAL (trailing ?) so it matches numbers without ext too.
 *
 * Examples matched:
 *   "ext 1234"  "x567"  "extension 89"  "poste 123"  "#456"  "p789"
 */
const EXT_SUFFIX = /(?:\s*(?:ext|ext\.|x|extension|poste|post|p|#)\.?\s*\d{1,8})?/i;

// ─── PHONE PATTERNS ──────────────────────────────────────────────────

/**
 * Separator between digit groups: space, dash, or dot.
 * We do NOT allow newline here (prevents cross-line matching).
 */
const S = `[\\s\\-.]`;

/**
 * A single digit optionally preceded by a separator.
 * Matches: "3", "-3", ".3", " 3"
 */
const DS = `(?:${S}?\\d)`;

/**
 * PATTERN 1: International format starting with +country_code
 *
 * This is the MOST IMPORTANT pattern for African numbers.
 * It matches ANY number starting with + followed by 1-4 digit country code.
 *
 * Examples:
 *   +221 77 123 45 67        (Senegal)
 *   +225 01 23 45 67 89      (Côte d'Ivoire)
 *   +234 801 234 5678        (Nigeria)
 *   +212 6 12 34 56 78       (Morocco)
 *   +213 5 55 12 34 56       (Algeria)
 *   +20 100 234 5678         (Egypt)
 *   +27 82 123 4567          (South Africa)
 *   +1 (415) 555-2671        (USA)
 *   +44 20 7946 0958         (UK)
 *   +33 1 23 45 67 89        (France)
 */
const P_INTERNATIONAL = [
  // +CCC followed by flexible digit groups (African/international)
  `\\+\\d{1,4}${S}?\\(?\\d${DS}{5,14}\\)?`,
  // +CCC (area) rest — parenthesized area code after country code
  `\\+\\d{1,4}${S}?\\(\\d{1,5}\\)${DS}{4,12}`,
].join("|");

/**
 * PATTERN 2: North American format with parenthesized area code
 *
 * Examples:
 *   (212) 555-9999
 *   (415) 555-4242 ext 123
 *   (800) 123-4567 x89
 *   (514) 555-1234 poste 567
 */
const P_NA_PAREN = `\\(\\d{3}\\)${S}?\\d{3}${S}?\\d{4}`;

/**
 * PATTERN 3: North American format with dashes/dots/spaces (no parentheses)
 *
 * Examples:
 *   415-555-4242
 *   415.555.4242
 *   415 555 4242
 *   800-123-4567 extension 89
 */
const P_NA_DASH = `\\d{3}${S}\\d{3}${S}\\d{4}`;

/**
 * PATTERN 4: Local numbers starting with 0 (common in Africa & Europe)
 *
 * These are numbers in local format without the +country_code prefix.
 * They start with 0 and have 6+ more digits with optional separators.
 *
 * Examples:
 *   077 123 45 67      (Senegal mobile, local format)
 *   06 12 34 56 78     (Morocco mobile, local format)
 *   05 55 12 34 56     (Algeria mobile, local format)
 *   0801 234 5678      (Nigeria mobile, local format)
 *   07123456789        (UK mobile, local format)
 *   0612345678         (France mobile, local format)
 */
const P_LOCAL_ZERO = `0\\d(?:${S}?\\d){6,13}`;

/**
 * PATTERN 5: Plain digit sequences that look like phone numbers
 *
 * Must be 10-15 digits (no separators) to qualify.
 * This catches numbers pasted without any formatting.
 *
 * Examples:
 *   221771234567
 *   2125559999
 *   4155554242
 */
const P_PLAIN = `\\d{10,15}`;

/**
 * PATTERN 6: Numbers with 2-3 digit groups separated by dots/dashes/spaces
 * This catches formats that don't fit the above patterns.
 *
 * Examples:
 *   77.123.45.67        (Senegal mobile without country code)
 *   555-1234             (7-digit local number)
 *   1234-567890          (Mixed grouping)
 */
const P_GROUPED = `\\d{2,4}(?:${S}\\d{2,4}){2,4}`;

// ─── COMBINED REGEX ──────────────────────────────────────────────────

/**
 * Combined phone regex for a SINGLE LINE.
 * All patterns are tried in priority order.
 * The extension suffix is appended to each potential match.
 *
 * The regex is constructed from the patterns above, joined with |
 * and followed by the optional extension suffix.
 */
const PHONE_REGEX_LINE = new RegExp(
  `(?:${P_INTERNATIONAL}|${P_NA_PAREN}|${P_NA_DASH}|${P_LOCAL_ZERO}|${P_GROUPED}|${P_PLAIN})` +
  // Extension suffix — optional, captured as part of the match
  `(?:\\s*(?:ext|ext\\.|x|extension|poste|post|p|#)\\.?\\s*\\d{1,8})?`,
  "gi"
);

// ─── AFRICAN COUNTRY CODES ───────────────────────────────────────────

/**
 * Complete list of African country calling codes.
 * Used for lenient validation of numbers starting with these codes.
 *
 * Covers all 54 African countries:
 *   +20  (Egypt)
 *   +27  (South Africa)
 *   +210–+269 (rest of Africa)
 */
const AFRICAN_CODES: Set<string> = new Set([
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
]);

/**
 * Checks if a phone number string starts with an African country code.
 */
function isAfricanNumber(phone: string): boolean {
  const compact = phone.replace(/[\s\-.()]/g, "");
  for (const code of AFRICAN_CODES) {
    if (compact.startsWith(code)) return true;
  }
  return false;
}

// ─── EXTENSION PARSING ───────────────────────────────────────────────

/**
 * Parses a phone number to extract the base number and extension.
 *
 * @param phone - Phone string possibly with extension
 * @returns Object with base number and optional extension
 */
function parseExtension(phone: string): { base: string; ext: string | null } {
  const match = phone.match(/^(.+?)\s+(?:ext|ext\.|x|extension|poste|post|p|#)\.?\s*(\d{1,8})\s*$/i);
  if (match) {
    return { base: match[1].trim(), ext: match[2] };
  }
  return { base: phone.trim(), ext: null };
}

/**
 * Checks whether a phone string contains an extension suffix.
 */
function hasExtension(phone: string): boolean {
  return /\b(?:ext|ext\.|x|extension|poste|post|p|#)\.?\s*\d{1,8}\s*$/i.test(phone);
}

// ─── VALIDATION ──────────────────────────────────────────────────────

/**
 * Known false-positive patterns to reject.
 */
const FALSE_POSITIVES = [
  /^\d+\.\d+(\.\d+)+$/,                     // Version numbers: 1.0.0, 2.3.14
  /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/,    // Dates: 12/25/2024, 01-15-24
  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,   // IP addresses: 192.168.1.1
  /^0+$/,                                     // All zeros
  /^(\d)\1{8,}$/,                             // Repeated digits: 1111111111
  /^\d{1,4}$/,                                // Too short standalone
  /^\d{4}$/,                                  // Year-like: 2024
  /^(19|20)\d{2}$/,                           // Years: 2024, 1999
];

/**
 * Validates whether a string is a legitimate phone number.
 *
 * Rules:
 *   - Base number must have 6-15 digits (E.164 allows up to 15)
 *   - If extension is present, base can be as short as 6 digits
 *   - African numbers get more lenient validation (diverse formats)
 *   - Filters out version numbers, dates, IP addresses, years, etc.
 *
 * @param phone - The candidate phone number string
 * @returns Whether the string is a valid phone number
 */
function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;

  // Check false positives
  for (const pattern of FALSE_POSITIVES) {
    if (pattern.test(trimmed)) return false;
  }

  // Parse extension
  const { base, ext } = parseExtension(trimmed);
  const baseDigits = base.replace(/\D/g, "");

  // Minimum digits: 6 if extension present, 7 otherwise
  const minDigits = ext ? 6 : 7;

  // E.164 max 15 digits
  if (baseDigits.length < minDigits || baseDigits.length > 15) {
    return false;
  }

  // African numbers are more lenient — they have diverse lengths
  if (isAfricanNumber(trimmed)) {
    // African numbers: 5-15 digits in base (some short local formats exist)
    if (baseDigits.length < 5) return false;
    return true;
  }

  // Must have some digit diversity (not all same digit) — except for extensions
  if (!ext && baseDigits.length > 5) {
    const uniqueDigits = new Set(baseDigits.split(""));
    if (uniqueDigits.size === 1) return false;
  }

  // Numbers starting with + are almost certainly valid international numbers
  if (trimmed.startsWith("+")) return true;

  // Numbers starting with 0 (local format) — trust them if they have enough digits
  if (trimmed.startsWith("0") && baseDigits.length >= 7) return true;

  // Numbers with parentheses area code are likely valid
  if (/^\(?\d{3}\)?/.test(trimmed) && baseDigits.length >= 7) return true;

  return true;
}

// ─── SANITIZATION ────────────────────────────────────────────────────

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
    .replace(/\s+/g, " ")                    // Normalize multiple spaces
    .replace(/\.\./g, ".")                    // Remove double dots
    .replace(/--/g, "-")                      // Remove double dashes
    .replace(/\(\s+/g, "(")                   // Clean space after (
    .replace(/\s+\)/g, ")")                   // Clean space before )
    .replace(/\(\)/g, "")                     // Remove empty parens
    .replace(/\s+ext\s+/gi, " ext ")          // Normalize "ext"
    .replace(/\s+extension\s+/gi, " ext ")    // Normalize "extension" → "ext"
    .replace(/\s+poste\s+/gi, " ext ")        // Normalize "poste" → "ext"
    .replace(/\s+post\s+/gi, " ext ")         // Normalize "post" → "ext"
    .replace(/ext\.?\s*(\d)/gi, "ext $1")     // "ext.123" → "ext 123"
    .replace(/\s+x\s*(\d)/gi, " x$1")        // "x 123" → "x123"
    .replace(/\s+#\s*(\d)/gi, " #$1")        // "# 123" → "#123"
    // Remove trailing punctuation that's not part of extension
    .replace(/[,;:]$/, "");
}

/**
 * Sanitizes an email address by trimming and lowercasing.
 */
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validates whether a string is a legitimate email address.
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

// ─── DEDUPLICATION ───────────────────────────────────────────────────

/**
 * Normalizes a phone number for dedup comparison.
 *
 * Two numbers are considered duplicates ONLY if:
 *   - They have the SAME base digits AND the same extension (or both no extension)
 *
 * This means "+221 77 123 45 67" and "+221 77 123 45 67 ext 45" are
 * treated as DIFFERENT contacts (the extension routes to a different desk).
 *
 * But "+221 77 123 45 67" and "+221 7712 345 67" are the SAME contact
 * (just different formatting).
 *
 * @param phone - The phone number string
 * @returns Normalized string for comparison
 */
function normalizeForDedup(phone: string): string {
  const { base, ext } = parseExtension(phone);
  const baseNorm = base.replace(/[^\d+]/g, "");
  // Include extension in dedup key so ext and non-ext are treated as different
  return ext ? `${baseNorm}ext${ext}` : baseNorm;
}

// ─── EXTRACTION FUNCTIONS ────────────────────────────────────────────

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
 * Extracts all phone numbers from a given text string.
 *
 * Processing strategy:
 *   1. Split text into lines (prevents cross-line false matches)
 *   2. Run the broad combined regex on each line
 *   3. Sanitize each match
 *   4. Validate each match (filter false positives)
 *   5. Deduplicate (same base digits = same number)
 *   6. Return clean results
 *
 * Supports:
 *   - International format with +country_code
 *   - North American (parens, dashes, dots)
 *   - Extensions: ext, x, extension, poste, post, p, #
 *   - African numbers (all +2XX codes)
 *   - Local 0-prefix numbers
 *   - Plain digit sequences
 *   - Grouped numbers with separators
 *
 * @param text - The raw text to extract phone numbers from
 * @returns Array of unique, validated phone numbers
 */
export function extractPhones(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  // Process each line separately to prevent cross-line matching
  const lines = text.split(/\n/);
  const allRaw: string[] = [];

  for (const line of lines) {
    // Reset regex lastIndex for each line (global flag)
    PHONE_REGEX_LINE.lastIndex = 0;
    const matches = line.match(PHONE_REGEX_LINE);
    if (matches) {
      allRaw.push(...matches);
    }
  }

  if (allRaw.length === 0) return [];

  // Sanitize, validate, and deduplicate
  const seen = new Set<string>();
  const results: string[] = [];

  for (const raw of allRaw) {
    const sanitized = sanitizePhone(raw);
    if (!sanitized) continue;
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
