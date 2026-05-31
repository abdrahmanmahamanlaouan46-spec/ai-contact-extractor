/**
 * Hero section component with animated gradient background and CTA.
 * Creates a striking first impression with motion effects.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-16 sm:min-h-[90vh]">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tl from-emerald-600/10 to-transparent blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI-Powered Contact Extraction</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
            AI Contact
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Extractor
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
        >
          Extract emails and phone numbers instantly from raw text using
          intelligent parsing and regex automation. Support for multiple
          international formats.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-base font-semibold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-teal-500"
            onClick={() => {
              document.getElementById("extractor")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Extracting
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 transition-opacity group-hover:opacity-20" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-xl border-border/50 px-8 text-base backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground sm:text-sm"
        >
          {["Email Extraction", "Phone Parsing", "International Formats", "Instant Copy", "Export JSON"].map(
            (feature, i) => (
              <span
                key={feature}
                className="rounded-full border border-border/50 bg-background/50 px-3 py-1 backdrop-blur-sm transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {feature}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
