"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

/**
 * Full-bleed hero background photo with scroll-linked scale/translateY —
 * scale 1.0 -> 1.07 and translateY 0 -> 4% across the hero's own viewport
 * crossing. Transforms the image only, never the text/scrim above it.
 * Disabled under prefers-reduced-motion (image renders static).
 */
export function HeroImage({ src, opacity, priority = false }: { src: string; opacity: number; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "4%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" style={{ opacity }} aria-hidden="true">
      <motion.div style={reduceMotion ? undefined : { scale, y }} className="absolute inset-0">
        <Image src={src} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
