/**
 * Main extractor card component — vibrant and colorful.
 * Textarea input, extract button, character counter.
 */

"use client";

import { motion } from "framer-motion";
import { Search, Loader2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ExtractorCardProps {
  text: string;
  onTextChange: (value: string) => void;
  onExtract: () => void;
  onClear: () => void;
  isExtracting: boolean;
  isDisabled: boolean;
  charCount: number;
  hasResults: boolean;
}

export function ExtractorCard({
  text,
  onTextChange,
  onExtract,
  onClear,
  isExtracting,
  isDisabled,
  charCount,
  hasResults,
}: ExtractorCardProps) {
  return (
    <motion.div
      id="extractor"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
        {/* Colorful gradient border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/8 via-violet-500/4 to-cyan-500/6" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/25 ring-1 ring-emerald-500/20">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Input Text</h2>
                <p className="text-sm text-muted-foreground">
                  Paste your raw text below
                </p>
              </div>
            </div>

            {/* Character counter */}
            <div className="flex items-center gap-2">
              {charCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20"
                >
                  {charCount.toLocaleString()} chars
                </motion.span>
              )}
              {charCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onClear}
                  aria-label="Clear text"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste text containing emails and phone numbers...&#10;&#10;Example: Contact us at hello@company.com or support@startup.io. Call us at +221 77 123 45 67 or +1 (415) 555-2671 ext 123."
              className="min-h-[200px] resize-y rounded-xl border-border/50 bg-background/50 text-base leading-relaxed backdrop-blur-sm transition-all focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 sm:min-h-[240px] md:min-h-[280px]"
              disabled={isExtracting}
              aria-label="Text input for contact extraction"
            />
          </div>

          {/* Action Bar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse" />
              Supports emails, African numbers, extensions & international formats
            </div>

            <div className="flex items-center gap-3">
              {/* Clear button */}
              {hasResults && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-border/50"
                    onClick={onClear}
                    disabled={isExtracting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </motion.div>
              )}

              {/* Extract button */}
              <Button
                size="lg"
                className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 disabled:opacity-50 disabled:shadow-none"
                onClick={onExtract}
                disabled={isDisabled || isExtracting}
              >
                {isExtracting ? (
                  <span className="relative z-10 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Extracting...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Extract Contacts
                  </span>
                )}
                {/* Animated glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-20" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
