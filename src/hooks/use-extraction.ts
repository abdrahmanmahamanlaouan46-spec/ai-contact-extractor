/**
 * Custom hook for managing the contact extraction state and logic.
 * Handles text input, extraction processing, and copy operations.
 */

"use client";

import { useState, useCallback } from "react";
import { extractContacts } from "@/utils/extractor";
import type { ExtractionResult } from "@/types/extractor";
import { defaultExtractionResult } from "@/types/extractor";

/**
 * Hook for managing contact extraction workflow.
 *
 * @returns Object containing extraction state and action functions
 */
export function useExtraction() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ExtractionResult>(defaultExtractionResult);
  const [isExtracting, setIsExtracting] = useState(false);

  /** Character count of the input text */
  const charCount = text.length;

  /** Whether the extract button should be disabled */
  const isDisabled = text.trim().length === 0;

  /**
   * Processes the input text and extracts contacts.
   * Includes a brief artificial delay for UX feedback.
   */
  const handleExtract = useCallback(async () => {
    if (isDisabled) return;

    setIsExtracting(true);

    // Brief delay for visual feedback / loading state
    await new Promise((resolve) => setTimeout(resolve, 600));

    const { emails, phones } = extractContacts(text);

    setResult({
      emails,
      phones,
      total: emails.length + phones.length,
      extracted: true,
    });

    setIsExtracting(false);
  }, [text, isDisabled]);

  /**
   * Clears the input text and resets extraction results.
   */
  const handleClear = useCallback(() => {
    setText("");
    setResult(defaultExtractionResult);
  }, []);

  /**
   * Copies the specified text to the clipboard.
   *
   * @param content - The text content to copy
   * @param label - A label for the toast notification
   */
  const copyToClipboard = useCallback(async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      return { success: true, label };
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return { success: true, label };
    }
  }, []);

  /**
   * Copies all extracted emails to clipboard.
   */
  const copyEmails = useCallback(async () => {
    if (result.emails.length === 0) return;
    return copyToClipboard(result.emails.join("\n"), "Emails");
  }, [result.emails, copyToClipboard]);

  /**
   * Copies all extracted phone numbers to clipboard.
   */
  const copyPhones = useCallback(async () => {
    if (result.phones.length === 0) return;
    return copyToClipboard(result.phones.join("\n"), "Phone numbers");
  }, [result.phones, copyToClipboard]);

  /**
   * Copies all extracted contacts (emails + phones) to clipboard.
   */
  const copyAll = useCallback(async () => {
    if (result.total === 0) return;
    const all = [...result.emails, ...result.phones].join("\n");
    return copyToClipboard(all, "All contacts");
  }, [result, copyToClipboard]);

  /**
   * Exports extracted contacts as a JSON file download.
   */
  const exportResults = useCallback(() => {
    if (result.total === 0) return;

    const data = {
      emails: result.emails,
      phones: result.phones,
      exportedAt: new Date().toISOString(),
      totalContacts: result.total,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  return {
    text,
    setText,
    result,
    isExtracting,
    charCount,
    isDisabled,
    handleExtract,
    handleClear,
    copyEmails,
    copyPhones,
    copyAll,
    exportResults,
  };
}
