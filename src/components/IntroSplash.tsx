"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export default function IntroSplash({ onFinish }: { onFinish?: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const words = useMemo(() => ["Christian", "Oscar", "Papa"], []);

  useEffect(() => {
    const ms = prefersReducedMotion ? 400 : 1500;
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onFinish?.(), 250);
    }, ms);
    return () => clearTimeout(t);
  }, [prefersReducedMotion, onFinish]);

  const word = {
    initial: { opacity: 0, filter: "blur(6px)", y: 6 },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.38, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          className="
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-neutral-950
            overflow-hidden
          "
        >
          {/* Gradiente radial sutil, mismo estilo que el main */}
          <div
            className="
              absolute inset-0 pointer-events-none
              bg-[radial-gradient(1200px_800px_at_50%_-20%,rgba(99,102,241,0.15),transparent_60%)]
            "
          />

          {/* Marco animado */}
          <div className="relative">
            <div
              className={`
                before:absolute before:-inset-[2px] before:rounded-2xl before:blur before:content-['']
                before:bg-[conic-gradient(var(--tw-gradient-stops))]
                before:from-indigo-400 before:via-violet-400 before:to-indigo-400
                before:opacity-80
                ${prefersReducedMotion ? "" : "before:animate-spin-slower"}
                rounded-2xl p-[2px]
                shadow-xl
              `}
            >
              <div
                className="
                  rounded-2xl border border-white/10
                  bg-neutral-950 px-6 py-4 md:px-8 md:py-6
                "
              >
                <div className="flex gap-2 md:gap-3 text-xl md:text-4xl font-semibold tracking-tight text-neutral-100">
                  {prefersReducedMotion ? (
                    <span>Christian&nbsp;Oscar&nbsp;Papa</span>
                  ) : (
                    words.map((w, i) => (
                      <motion.span
                        key={w + i}
                        variants={word}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.12 * i }}
                      >
                        {w}
                      </motion.span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
