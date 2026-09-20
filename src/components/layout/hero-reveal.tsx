"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Hero entrance stagger — label/h1/lede/meta/CTAs animate in on mount,
 * 90ms apart. Under prefers-reduced-motion, children start (and stay) in
 * their final "show" state — no animation runs at all, not just a faster
 * one.
 */
export function HeroReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={container} initial={reduceMotion ? "show" : "hidden"} animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function HeroRevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
