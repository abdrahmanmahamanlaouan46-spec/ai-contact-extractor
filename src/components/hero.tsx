/**
 * Hero section component with animated gradient background and CTA.
 * Vibrant, colorful, and visually striking first impression.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Mail, Phone, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-16 sm:min-h-[90vh]">
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Main gradient blob */}
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-400/15 to-cyan-400/10 blur-[130px]" />
        {/* Violet accent */}
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-violet-500/10 to-transparent blur-[100px]" />
        {/* Amber accent bottom */}
        <div className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-amber-400/8 to-transparent blur-[80px]" />
        {/* Rose accent */}
        <div className="absolute top-1/2 right-1/3 h-[250px] w-[250px] rounded-full bg-gradient-to-l from-rose-400/6 to-transparent blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-1.5 text-sm text-emerald-400 backdrop-blur-sm"
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
          <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Contact
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
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
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 transition-opacity group-hover:opacity-20" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-xl border-border/50 px-8 text-base backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
            asChild
          >
            <a
              href="https://github.com/abdrahmanmahamanlaouan46-spec/ai-contact-extractor"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </motion.div>

        {/* Feature cards with colored icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {[
            { icon: Mail, label: "Email Extraction", color: "text-emerald-400", bg: "from-emerald-500/15 to-emerald-500/5", border: "hover:border-emerald-500/40" },
            { icon: Phone, label: "Phone Parsing", color: "text-cyan-400", bg: "from-cyan-500/15 to-cyan-500/5", border: "hover:border-cyan-500/40" },
            { icon: Globe, label: "African Formats", color: "text-violet-400", bg: "from-violet-500/15 to-violet-500/5", border: "hover:border-violet-500/40" },
            { icon: Zap, label: "Instant Copy", color: "text-amber-400", bg: "from-amber-500/15 to-amber-500/5", border: "hover:border-amber-500/40" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className={`group flex flex-col items-center gap-2 rounded-xl border border-border/30 bg-gradient-to-b ${feature.bg} p-4 backdrop-blur-sm transition-all ${feature.border} hover:bg-opacity-200`}
            >
              <feature.icon className={`h-5 w-5 ${feature.color} transition-transform group-hover:scale-110`} />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors sm:text-sm">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
