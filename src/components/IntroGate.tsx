// src/components/IntroGate.tsx (como lo pasaste)
"use client";

import { useCallback } from "react";
import IntroSplash from "./IntroSplash";

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const handleFinish = useCallback(() => {
    const main = document.getElementById("content") as HTMLElement | null;
    main?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <IntroSplash onFinish={handleFinish} />
      {children}
    </>
  );
}
