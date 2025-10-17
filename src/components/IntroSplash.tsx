"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  onFinish?: () => void;
  /** Duración total antes de autocerrar (ms). Si null, sólo cierra con botón. */
  autoCloseMs?: number | null;
};

export default function IntroSplash({ onFinish, autoCloseMs = 2200 }: Props) {
  const [open, setOpen] = useState(true);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!autoCloseMs) return;
    const id = setTimeout(() => handleClose(), autoCloseMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCloseMs]);

  function handleClose() {
    setOpen(false);
    // Pequeño delay para permitir la animación de salida
    setTimeout(() => onFinish?.(), 220);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] isolate"
          aria-label="Pantalla de introducción"
          role="dialog"
          aria-modal="true"
        >
          {/* Capa base oscura */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120a26] to-black" />

          {/* Aura con conic-gradient + blur (gira si no hay reduced motion) */}
          <motion.div
            aria-hidden
            className="absolute -inset-[10%] blur-3xl opacity-35"
            style={{
              background:
                "conic-gradient(from 0deg at 30% 50%, #6d28d9, #14b8a6, #1e3a8a, #6d28d9)",
            }}
            animate={prefersReduced ? { rotate: 0 } : { rotate: 360 }}
            transition={
              prefersReduced
                ? undefined
                : { repeat: Infinity, ease: "linear", duration: 28 }
            }
          />

          {/* Grain / ruido sutil para textura */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 .25 .45 .25 0 0 0 0'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />

          {/* Contenido centrado */}
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            {/* Tarjeta con “Electric Border” */}
            <div className="relative">
              {/* Borde eléctrico (capa exterior animada) */}
              <motion.div
                aria-hidden
                className="absolute -inset-[2px] rounded-2xl"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, rgba(99,102,241,0.9), rgba(168,85,247,0.9), rgba(20,184,166,0.9), rgba(99,102,241,0.9))",
                  filter: "blur(8px)",
                  opacity: 0.7,
                }}
                animate={prefersReduced ? { rotate: 0 } : { rotate: -360 }}
                transition={
                  prefersReduced
                    ? undefined
                    : { repeat: Infinity, ease: "linear", duration: 22 }
                }
              />

              {/* Tarjeta interior */}
              <motion.div
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative rounded-2xl border border-white/10 bg-neutral-950/80 px-8 py-10 shadow-[0_0_60px_rgba(80,56,237,0.15)] backdrop-blur-xl"
              >
                {/* Glow tenue interior */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow:
                      "inset 0 0 60px rgba(99,102,241,0.10), 0 0 40px rgba(79,70,229,0.12)",
                  }}
                />

                <div className="relative z-10 text-center">
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                    className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
                  >
                    Christian Oscar Papa
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.35 }}
                    className="mt-3 text-base md:text-lg text-neutral-300"
                  >
                    Desarrollador Frontend — React · Next.js · TypeScript
                  </motion.p>

                  {/* Línea luminosa */}
                  <motion.div
                    aria-hidden
                    initial={{ width: 0, opacity: 0.0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{
                      delay: 0.22,
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent"
                    style={{ maxWidth: 420 }}
                  />

                  {/* Botón Accesible (por si el usuario quiere saltar la intro) */}
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.3 }}
                    className="
                      focus:outline-none focus-visible:ring-2 ring-indigo-400 ring-offset-2 ring-offset-neutral-950
                      mt-6 inline-flex items-center justify-center rounded-full border border-white/15
                      bg-white/10 px-5 py-2 text-sm font-semibold text-white
                      hover:bg-white/15 active:scale-[0.98] transition
                    "
                    aria-label="Entrar al sitio"
                  >
                    Entrar
                  </motion.button>

                  {/* Mensaje Reduced Motion */}
                  {prefersReduced && (
                    <p className="mt-3 text-xs text-neutral-400">
                      Animaciones reducidas por preferencia del sistema.
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
