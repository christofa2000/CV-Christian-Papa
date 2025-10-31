"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = { onFinish?: () => void; autoCloseMs?: number | null };

export default function IntroSplash({ onFinish, autoCloseMs = 2200 }: Props) {
  const [open, setOpen] = useState(true);
  const [textBounds, setTextBounds] = useState({ width: 0, height: 0 });
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!autoCloseMs) return;
    const id = setTimeout(() => {
      setOpen(false);
      setTimeout(() => onFinish?.(), 200);
    }, autoCloseMs);
    return () => clearTimeout(id);
  }, [autoCloseMs, onFinish]);

  useEffect(() => {
    if (textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      setTextBounds({ width: rect.width, height: rect.height });
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Intro"
        >
          {/* Fondo oscuro + grain (opcional) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120a26] to-black" />
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
            aria-hidden
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="relative z-10 flex h-full items-center justify-center px-6">
            {/* === TEXTO CON ESTILO MEJORADO === */}
            <motion.div
              ref={textRef}
              className="relative inline-block select-none text-center"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {/* Efecto de texto con gradiente y sombra */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter:
                    "drop-shadow(0 0 20px rgba(29, 78, 216, 0.3)) drop-shadow(0 0 40px rgba(37, 99, 235, 0.2))",
                  textShadow:
                    "0 0 30px rgba(29, 78, 216, 0.5), 0 0 60px rgba(37, 99, 235, 0.3)",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Christian Oscar Papa
              </motion.h1>

              <motion.p
                className="mt-3 text-lg md:text-xl text-neutral-300/90 leading-relaxed font-medium"
                style={{
                  textShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                Desarrollador Frontend — React · Next.js · TypeScript
              </motion.p>

              {/* Borde de neon dinámico */}
              <NeonBorder
                reduced={!!prefersReduced}
                width={textBounds.width}
                height={textBounds.height}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NeonBorder({
  reduced,
  width,
  height,
}: {
  reduced: boolean;
  width: number;
  height: number;
}) {
  // Si no tenemos dimensiones aún, no renderizar
  if (width === 0 || height === 0) return null;

  // Margen para el borde de neon
  const padding = 32;
  const strokeWidth = 3;
  const r = 20; // Radio más suave

  // Coordenadas del rectángulo dentro del SVG
  const x = strokeWidth / 2;
  const y = strokeWidth / 2;
  const w = width + padding - strokeWidth;
  const h = height + padding - strokeWidth;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute"
      viewBox={`0 0 ${width + padding} ${height + padding}`}
      preserveAspectRatio="none"
      style={{
        width: width + padding,
        height: height + padding,
        left: -padding / 2,
        top: -padding / 2,
      }}
    >
      <defs>
        <linearGradient id="nbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="30%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Gradiente radial para efecto de glow más suave */}
        <radialGradient id="nbGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
        </radialGradient>

        {/* Filtro de glow mejorado */}
        <filter id="nbGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Filtro de glow más intenso para el efecto principal */}
        <filter
          id="nbGlowIntense"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
        >
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Fondo sutil con gradiente radial */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill="url(#nbGlowGrad)"
        opacity="0.08"
      />

      {/* Línea base tenue */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        ry={r}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />

      {/* Borde de neon animado */}
      {!reduced ? (
        <motion.rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill="none"
          stroke="url(#nbGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#nbGlowIntense)"
          style={{ mixBlendMode: "screen" }}
          strokeDasharray={`${(w + h) * 0.15} ${(w + h) * 0.85}`}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -(w + h) * 2 }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill="none"
          stroke="url(#nbGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#nbGlowIntense)"
          style={{ mixBlendMode: "screen", opacity: 0.9 }}
        />
      )}
    </svg>
  );
}
