"use client";
import { createContext, useContext, useState } from "react";

interface StoryContextValue {
  activeStep: number;
  setActiveStep: (i: number) => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <StoryContext.Provider value={{ activeStep, setActiveStep }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory(): StoryContextValue {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within a StoryProvider");
  return ctx;
}
