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

  // Variantes: entran desde fuera de pantalla hacia el centro
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
      viewport={{ once: false, amount: 0.3 }} // reanima cuando navegas
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto a la izquierda, centrado verticalmente dentro de su columna */}
          <motion.div
            variants={leftEnter}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
          >
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-semibold text-neutral-200 leading-tight">
                Hola, soy{" "}
                <span className="text-violet-400">Christian Oscar Papa</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed">
                Desarrollador Frontend especializado en React, Next.js y
                TypeScript. Creando experiencias web modernas, accesibles y
                performantes.
              </p>
            </div>

            {/* CTA Buttons — redondeados completos */}
            <div className="flex flex-col sm:flex-row gap-4">
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

          {/* Foto a la derecha — redonda y centrada */}
          <motion.div
            variants={rightEnter}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Halo suave detrás */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 to-indigo-500/25 rounded-full blur-2xl" />
              {/* Marco + imagen redonda */}
              <div className="relative w-full h-full rounded-full border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/Fotocv.png"
                  alt="Christian Oscar Papa - Frontend Developer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
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
