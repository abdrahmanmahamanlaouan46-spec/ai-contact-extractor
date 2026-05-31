/**
 * Animated floating orbs background component.
 * Creates a vibrant, colorful ambient animated background effect.
 */

"use client";

import { motion } from "framer-motion";

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Emerald orb — top left */}
      <motion.div
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px]"
        animate={{
          x: [0, 120, 60, 0],
          y: [0, 60, 120, 0],
          scale: [1, 1.2, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Teal orb — right side */}
      <motion.div
        className="absolute top-1/4 -right-32 h-[450px] w-[450px] rounded-full bg-teal-400/12 blur-[120px]"
        animate={{
          x: [0, -90, -40, 0],
          y: [0, -70, -130, 0],
          scale: [1, 1.15, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cyan orb — bottom left */}
      <motion.div
        className="absolute -bottom-32 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[110px]"
        animate={{
          x: [0, 70, -40, 0],
          y: [0, -90, -50, 0],
          scale: [1, 1.1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Violet orb — center-right */}
      <motion.div
        className="absolute top-2/3 right-1/3 h-[350px] w-[350px] rounded-full bg-violet-500/8 blur-[100px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 1.15, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Amber orb — top right accent */}
      <motion.div
        className="absolute -top-20 right-1/4 h-[300px] w-[300px] rounded-full bg-amber-400/6 blur-[100px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 80, 40, 0],
          scale: [1, 1.1, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Rose orb — bottom center accent */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 h-[250px] w-[250px] rounded-full bg-rose-400/5 blur-[90px]"
        animate={{
          x: [0, 80, -20, 0],
          y: [0, -50, -80, 0],
          scale: [1, 1.08, 1.15, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
