"use client";

import { fadeInUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const scrollToProjects = () => {
    const element = document.getElementById("proyectos");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contacto");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Texto a la izquierda */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-semibold text-neutral-200 leading-tight">
                Hola, soy{" "}
                <span className="text-violet-400">Christian Oscar Papa</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-2xl">
                Desarrollador Frontend especializado en React, Next.js y
                TypeScript. Creando experiencias web modernas, accesibles y
                performantes.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={scrollToProjects}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors focus-ring shadow-lg hover:shadow-xl"
              >
                Ver proyectos
                <ArrowDown
                  size={20}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>

              <button
                onClick={scrollToContact}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-neutral-600 text-neutral-200 font-semibold rounded-2xl hover:bg-neutral-800 transition-colors focus-ring"
              >
                <Mail size={20} />
                Contacto
              </button>
            </motion.div>
          </motion.div>

          {/* Foto a la derecha */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-3xl blur-xl"></div>
              <div className="relative w-full h-full rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <Image
                  src="/Fotocv.png"
                  alt="Christian Oscar Papa - Frontend Developer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 384px"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
