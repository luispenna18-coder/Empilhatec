"use client";

import { motion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: Direction;
  distance?: number;
  duration?: number;
}

const directionOffset = (dir: Direction, distance: number) => {
  switch (dir) {
    case "up":    return { y: distance };
    case "down":  return { y: -distance };
    case "left":  return { x: distance };
    case "right": return { x: -distance };
    case "none":  return {};
  }
};

export default function FadeUp({
  children,
  delay = 0,
  className = "",
  direction = "up",
  distance = 24,
  duration = 0.6,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
