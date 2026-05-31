/**
 * Modern footer component with sticky bottom behavior.
 * Includes links, tech stack, and copyright.
 */

"use client";

import { motion } from "framer-motion";
import { Github, Sparkles, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-auto border-t border-border/30 bg-background/50 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">
                AI Contact<span className="text-emerald-500"> Extractor</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Intelligent contact extraction powered by advanced regex patterns.
              Extract emails and phone numbers from any raw text instantly.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Links</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-emerald-400"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-emerald-400"
              >
                Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-emerald-400"
              >
                Report an Issue
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-border/30" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {currentYear} AI Contact Extractor. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart className="h-3 w-3 fill-emerald-500 text-emerald-500" /> for
            the community
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
