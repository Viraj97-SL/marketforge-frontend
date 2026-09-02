"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useStory } from "./story-context";

interface StickyVisualProps {
  scenes: React.ReactNode[];
  captions: string[];
}

/**
 * The persistent visual pane — the workshop's "morphing chart state"
 * technique: one fixed panel that cross-fades between scenes as the reader
 * scrolls through steps, instead of a separate static chart per section.
 */
export function StickyVisual({ scenes, captions }: StickyVisualProps) {
  const { activeStep } = useStory();

  return (
    <div className="hidden lg:flex sticky top-20 h-[calc(100vh-6rem)] flex-col items-start justify-center px-12" style={{ borderLeft: "1px solid var(--story-line)" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-start"
        >
          {scenes[activeStep]}
          {captions[activeStep] && (
            <p className="text-[10px] mt-8 max-w-xs" style={{ color: "var(--story-text-mute)" }}>
              {captions[activeStep]}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
