/**
 * Results display component showing extracted emails and phone numbers.
 * Features animated counts, copy buttons, scrollable lists, and empty states.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Copy,
  Check,
  Download,
  Inbox,
  SearchX,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExtractionResult } from "@/types/extractor";

interface ResultsCardProps {
  result: ExtractionResult;
  onCopyEmails: () => Promise<{ success: boolean; label: string } | undefined>;
  onCopyPhones: () => Promise<{ success: boolean; label: string } | undefined>;
  onCopyAll: () => Promise<{ success: boolean; label: string } | undefined>;
  onExport: () => void;
  onToast: (message: string) => void;
}

/** Animated counter that counts up from 0 to target */
function AnimatedCounter({ target }: { target: number }) {
  return (
    <motion.span
      key={target}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold tabular-nums"
    >
      {target}
    </motion.span>
  );
}

/** Copy button with animated feedback */
function CopyButton({
  onClick,
  label,
  disabled,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const result = await onClick();
    if (result?.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 rounded-lg border-border/50 text-xs transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
      onClick={handleClick}
      disabled={disabled}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 h-3 w-3 text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3 w-3" />
          {label}
        </>
      )}
    </Button>
  );
}

/** Single contact result card for either emails or phones */
function ContactResultCard({
  type,
  items,
  onCopy,
  onToast,
}: {
  type: "email" | "phone";
  items: string[];
  onCopy: () => Promise<{ success: boolean; label: string } | undefined>;
  onToast: (message: string) => void;
}) {
  const Icon = type === "email" ? Mail : Phone;
  const title = type === "email" ? "Emails" : "Phone Numbers";
  const gradientClass =
    type === "email"
      ? "from-emerald-500/20 to-teal-500/20"
      : "from-cyan-500/20 to-blue-500/20";
  const iconColor = type === "email" ? "text-emerald-500" : "text-cyan-500";
  const badgeColor =
    type === "email"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  const hoverBorder =
    type === "email"
      ? "hover:border-emerald-500/30"
      : "hover:border-cyan-500/30";
  const emptyIcon = <Inbox className="h-8 w-8" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: type === "email" ? 0.1 : 0.2 }}
      className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl transition-colors"
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-border/30 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {items.length === 1
                ? "1 found"
                : `${items.length} found`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`rounded-full text-xs ${badgeColor}`}
          >
            <AnimatedCounter target={items.length} />
          </Badge>
          <CopyButton
            onClick={async () => {
              const result = await onCopy();
              if (result?.success) {
                onToast(`${result.label} copied to clipboard!`);
              }
              return result;
            }}
            label="Copy"
            disabled={items.length === 0}
          />
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 sm:p-5">
        {items.length > 0 ? (
          <ScrollArea className="max-h-64 sm:max-h-80">
            <div className="space-y-1.5 pr-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`group flex items-center justify-between rounded-lg border border-border/30 px-3 py-2 text-sm transition-colors ${hoverBorder} hover:bg-muted/50`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-xs font-mono text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate font-mono">{item}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        navigator.clipboard.writeText(item);
                        onToast(`Copied: ${item}`);
                      }}
                      aria-label={`Copy ${item}`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="mb-3 rounded-full bg-muted/50 p-3">
              {emptyIcon}
            </div>
            <p className="text-sm font-medium">
              No {type === "email" ? "emails" : "phone numbers"} detected
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Try pasting text with{" "}
              {type === "email" ? "email addresses" : "phone numbers"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ResultsCard({
  result,
  onCopyEmails,
  onCopyPhones,
  onCopyAll,
  onExport,
  onToast,
}: ResultsCardProps) {
  if (!result.extracted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Section header with actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Results</h2>
          <p className="text-sm text-muted-foreground">
            {result.total === 0
              ? "No contacts found in the provided text"
              : `Found ${result.total} contact${result.total === 1 ? "" : "s"}`}
          </p>
        </div>

        {result.total > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <CopyButton
              onClick={async () => {
                const res = await onCopyAll();
                if (res?.success) {
                  onToast("All contacts copied to clipboard!");
                }
                return res;
              }}
              label="Copy All"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-border/50 text-xs transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
              onClick={onExport}
            >
              <Download className="mr-1.5 h-3 w-3" />
              Export JSON
            </Button>
          </motion.div>
        )}
      </div>

      {/* Results grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <ContactResultCard
          type="email"
          items={result.emails}
          onCopy={onCopyEmails}
          onToast={onToast}
        />
        <ContactResultCard
          type="phone"
          items={result.phones}
          onCopy={onCopyPhones}
          onToast={onToast}
        />
      </div>

      {/* Empty state when no contacts found */}
      {result.total === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/30 py-16 text-center backdrop-blur-xl"
        >
          <div className="mb-4 rounded-full bg-muted/50 p-4">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Contacts Detected</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find any email addresses or phone numbers in the
            provided text. Make sure the text contains valid contact
            information.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
