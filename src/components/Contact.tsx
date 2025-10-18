"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

        {/* Íconos del stack (skillicons.dev) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={fade}
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
