"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/** Fade para el bloque de texto */
const fadeText = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/** Variants para el grid con stagger suave */
const gridStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.25,
      /** controla el delay entre hijos */
      staggerChildren: 0.06,
      /** leve retardo inicial para que se lea el título antes */
      delayChildren: 0.1,
    },
  },
};

/** Variants para cada ícono */
const iconIn = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

export default function AboutMe() {
  return (
    <section id="sobre-mi" className="py-32 md:py-40 bg-neutral-900/30">
      <div className="mx-auto max-w-5xl px-4">
        {/* Texto principal */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.35 }}
          variants={fadeText}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-neutral-200 text-center">
            Sobre mí
          </h2>

          <p className="mt-6 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Soy{" "}
            <span className="text-neutral-200 font-medium">
              Desarrollador Frontend
            </span>{" "}
            especializado en <span className="text-neutral-200">React</span> y{" "}
            <span className="text-neutral-200">TypeScript</span>.
            <br />
            Diseño experiencias web modernas, accesibles y precisas, donde cada
            detalle cuenta y la arquitectura se mantiene limpia y escalable.
          </p>

          <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Trabajo con <span className="text-neutral-200">Next.js</span>,{" "}
            <span className="text-neutral-200">Tailwind</span> y{" "}
            <span className="text-neutral-200">Node.js</span>, aplicando buenas
            prácticas, tipado estricto y tests automatizados con{" "}
            <span className="text-neutral-200">Jest</span> y{" "}
            <span className="text-neutral-200">React Testing Library</span>.
          </p>

          <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Valoro la <span className="text-neutral-200">claridad</span>, la{" "}
            <span className="text-neutral-200">colaboración</span> y el{" "}
            <span className="text-neutral-200">aprendizaje constante</span> como
            parte esencial de mi forma de crear.
          </p>
        </motion.div>

        {/* Íconos del stack (skillicons.dev) con stagger */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={gridStagger}
          className="mt-14 md:mt-16 flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6"
        >
          {[
            "react",
            "nextjs",
            "typescript",
            "javascript",
            "tailwind",
            "redux",
            "prisma",
            "postgres",
            "nodejs",
            "cloudflare",
            "vercel",
            "git",
            "github",
            "figma",
            "vitest",
            "jest",
          ].map((icon) => (
            <motion.div
              key={icon}
              variants={iconIn}
              whileHover={{ scale: 1.12, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <Image
                src={`https://skillicons.dev/icons?i=${icon}&theme=dark`}
                alt={icon}
                width={56}
                height={56}
                unoptimized
                className="rounded-lg"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
