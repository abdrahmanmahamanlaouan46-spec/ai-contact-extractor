/**
 * Modern footer component with sticky bottom behavior.
 * Includes links, tech stack, and copyright. Colorful and vibrant.
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
      className="mt-auto border-t border-border/30 bg-gradient-to-b from-background/80 to-background backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">
                AI Contact<span className="text-emerald-400"> Extractor</span>
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
                href="https://github.com/abdrahmanmahamanlaouan46-spec/ai-contact-extractor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-emerald-400"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </a>
              <a
                href="https://github.com/abdrahmanmahamanlaouan46-spec/ai-contact-extractor/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-violet-400"
              >
                Report an Issue
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Next.js", color: "hover:border-emerald-500/40 hover:text-emerald-400" },
                { name: "React", color: "hover:border-cyan-500/40 hover:text-cyan-400" },
                { name: "TypeScript", color: "hover:border-violet-500/40 hover:text-violet-400" },
                { name: "Tailwind CSS", color: "hover:border-teal-500/40 hover:text-teal-400" },
                { name: "Framer Motion", color: "hover:border-amber-500/40 hover:text-amber-400" },
                { name: "Lucide", color: "hover:border-rose-500/40 hover:text-rose-400" },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
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
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> for
            the community
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
