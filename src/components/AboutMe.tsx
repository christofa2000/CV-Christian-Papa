"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  { name: "React", file: "react.svg" },
  { name: "Next.js", file: "nextjs.svg" }, // <-- asegurate que exista exactamente
  { name: "TypeScript", file: "typescript.svg" },
  { name: "Tailwind CSS", file: "tailwindcss.svg" },
  { name: "Framer Motion", file: "framermotion.svg" },
  { name: "Node.js", file: "nodejs.svg" },
  { name: "GitHub", file: "github.svg" },
  { name: "Figma", file: "figma.svg" },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function AboutMe() {
  return (
    <section id="sobre-mi" className="py-32 md:py-40 bg-neutral-900/30">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.35 }}
          variants={fade}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-neutral-200">
            Sobre mí
          </h2>
          <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Soy desarrollador frontend, enfocado en crear experiencias web
            modernas, accesibles y de alto rendimiento con React y Next.js.
          </p>
          <p className="mt-4 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Disfruto trabajar en equipo, documentar bien y mejorar los procesos
            con buenas prácticas.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={fade}
          className="mt-14 md:mt-16"
        >
          <h3 className="text-center text-xl font-semibold text-neutral-200">
            Tecnologías
          </h3>

          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-8 md:gap-10 justify-items-center">
            {skills.map(({ name, file }) => {
              const needsWhiteBg = name === "GitHub" || name === "Next.js";
              return (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center"
                  aria-label={name}
                  title={name}
                >
                  <div
                    className={[
                      "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/10 shadow-lg ring-1 ring-white/10 grid place-items-center",
                      needsWhiteBg
                        ? "bg-white"
                        : "bg-neutral-800/40 backdrop-blur-sm",
                    ].join(" ")}
                  >
                    <Image
                      src={`/logos/${file}`}
                      alt={name}
                      width={48}
                      height={48}
                      className={[
                        "w-10 h-10 md:w-12 md:h-12 object-contain",
                        needsWhiteBg ? "mix-blend-multiply" : "",
                      ].join(" ")}
                    />
                    <div className="pointer-events-none absolute -inset-2 rounded-3xl blur-2xl opacity-10 bg-white/20" />
                  </div>
                  <span className="mt-3 text-sm md:text-base text-neutral-300">
                    {name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
