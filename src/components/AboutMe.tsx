"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  { name: "React", file: "icons/react.svg" },
  { name: "Next.js", file: "icons/nextjs.svg" },
  { name: "TypeScript", file: "icons/typescript.svg" },
  { name: "Tailwind CSS", file: "icons/tailwindcss.svg" },
  { name: "Framer Motion", file: "icons/framermotion.svg" },
  { name: "Node.js", file: "icons/nodejs.svg" },
  { name: "GitHub", file: "icons/github.svg" },
  { name: "Figma", file: "icons/figma.svg" },
];

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
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
          variants={fade}
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
            <span className="text-neutral-200">TypeScript</span>. Creo
            experiencias web modernas, accesibles y de alto rendimiento, con
            foco en la escalabilidad y el detalle.
          </p>

          <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Trabajo con <span className="text-neutral-200">Next.js</span>,{" "}
            <span className="text-neutral-200">Zustand</span>,{" "}
            <span className="text-neutral-200">React Query</span> y{" "}
            <span className="text-neutral-200">Tailwind</span>, aplicando buenas
            prácticas y tests con <span className="text-neutral-200">Jest</span>{" "}
            y <span className="text-neutral-200">React Testing Library</span>.
          </p>

          <p className="mt-5 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            Me definen la <span className="text-neutral-200">comunicación</span>
            , la <span className="text-neutral-200">adaptabilidad</span> y el
            trabajo en equipo, siempre buscando mejorar procesos y aprender algo
            nuevo en cada proyecto.
          </p>
        </motion.div>

        {/* Logos de tecnologías */}
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
                    {/* Usamos next/image para optimización */}
                    <Image
                      src={`/${file}`}
                      alt={name}
                      width={48}
                      height={48}
                      className={[
                        "w-10 h-10 md:w-12 md:h-12 object-contain",
                        needsWhiteBg ? "mix-blend-multiply" : "",
                      ].join(" ")}
                      onError={(e) => {
                        // Fallback visual si hubiera un typo/ruta rota:
                        (e.currentTarget as HTMLImageElement).style.opacity =
                          "0.3";
                        (
                          e.currentTarget as HTMLImageElement
                        ).title = `No se encontró /${file}`;
                      }}
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
