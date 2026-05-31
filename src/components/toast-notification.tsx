/**
 * Toast notification component using Sonner.
 * Provides animated feedback for copy and export actions.
 */

"use client";

import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

/**
 * Displays a success toast notification.
 *
 * @param message - The message to display
 */
export function showToast(message: string) {
  toast.success(message, {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    style: {
      borderRadius: "12px",
      border: "1px solid var(--border)",
      background: "var(--card)",
      color: "var(--card-foreground)",
    },
  });
}
