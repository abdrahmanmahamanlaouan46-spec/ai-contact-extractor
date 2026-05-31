/**
 * Animated floating orbs background component.
 * Creates a subtle, ambient animated background effect.
 */

"use client";

import { motion } from "framer-motion";

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Primary orb */}
      <motion.div
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]"
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-teal-500/8 blur-[120px]"
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
          scale: [1, 1.15, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tertiary orb */}
      <motion.div
        className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-cyan-500/6 blur-[100px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -80, -40, 0],
          scale: [1, 1.1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
