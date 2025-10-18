"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const scrollToProjects = () => {
    document
      .getElementById("proyectos")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  const leftEnter = {
    hidden: { x: -220, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 14 },
    },
  };

  const rightEnter = {
    hidden: { x: 220, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 14, delay: 0.05 },
    },
  };

  return (
    <motion.section
      className="min-h-[92vh] flex items-center py-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="mx-auto max-w-6xl md:max-w-7xl px-4 sm:px-6 lg:px-8 2xl:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            variants={leftEnter}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6"
          >
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-semibold text-neutral-200 leading-tight">
                Hola, soy{" "}
                <span className="text-violet-400">Christian Oscar Papa</span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                Desarrollador Frontend especializado en React, Next.js y
                TypeScript. Creando experiencias web modernas, accesibles y
                performantes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={scrollToProjects}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors focus-ring shadow-lg hover:shadow-xl"
              >
                Ver proyectos
                <ArrowDown
                  size={20}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>

              <button
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-600 text-neutral-200 font-semibold rounded-full hover:bg-neutral-800 transition-colors focus-ring"
              >
                <Mail size={20} />
                Contacto
              </button>
            </div>
          </motion.div>

          {/* Foto con halo pulsante y encuadre alto */}
          <motion.div variants={rightEnter} className="flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem]">
              {/* Halo pulsante */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.22) 35%, rgba(0,0,0,0) 70%)",
                  filter: "blur(10px)",
                }}
                animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Marco + imagen redonda (objectPosition alto) */}
              <div className="relative w-full h-full rounded-full border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/Fotocv.png"
                  alt="Christian Oscar Papa - Frontend Developer"
                  fill
                  className="object-cover"
                  // Enfoca más arriba: centra en X y sube en Y (20%)
                  style={{ objectPosition: "50% 20%" }}
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 416px"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
