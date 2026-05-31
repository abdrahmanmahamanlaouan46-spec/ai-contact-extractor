/**
 * Type definitions for the AI Contact Extractor application.
 * Defines the structure for extraction results and contact items.
 */

/** Represents a single extracted contact item with its type and source */
export interface ContactItem {
  /** The extracted value (email or phone number) */
  value: string;
  /** The type of contact information */
  type: "email" | "phone";
}

/** Result of the extraction process */
export interface ExtractionResult {
  /** Array of extracted email addresses */
  emails: string[];
  /** Array of extracted phone numbers */
  phones: string[];
  /** Total count of extracted contacts */
  total: number;
  /** Whether extraction has been performed */
  extracted: boolean;
}

/** Default empty extraction result */
export const defaultExtractionResult: ExtractionResult = {
  emails: [],
  phones: [],
  total: 0,
  extracted: false,
};
