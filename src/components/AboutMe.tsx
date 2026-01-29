"use client";

import { motion } from "framer-motion";
import LogoLoop from "./LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiRedux,
  SiPrisma,
  SiPostgresql,
  SiNodedotjs,
  SiCloudflare,
  SiVercel,
  SiGit,
  SiGithub,
  SiFigma,
  SiVitest,
  SiJest,
} from "react-icons/si";

/** Fade para el bloque de texto */
const fadeText = {
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

        {/* Logos del stack con LogoLoop */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={fadeText}
          className="mt-14 md:mt-16"
        >
          <div className="text-neutral-300">
            <LogoLoop
              logos={[
                {
                  node: <SiReact className="text-[#61dafb]" />,
                  title: "React",
                  href: "https://react.dev",
                },
                {
                  node: <SiNextdotjs className="text-white" />,
                  title: "Next.js",
                  href: "https://nextjs.org",
                },
                {
                  node: <SiTypescript className="text-[#3178c6]" />,
                  title: "TypeScript",
                  href: "https://www.typescriptlang.org",
                },
                {
                  node: <SiJavascript className="text-[#f7df1e]" />,
                  title: "JavaScript",
                  href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                },
                {
                  node: <SiTailwindcss className="text-[#06b6d4]" />,
                  title: "Tailwind CSS",
                  href: "https://tailwindcss.com",
                },
                {
                  node: <SiRedux className="text-[#764abc]" />,
                  title: "Redux",
                  href: "https://redux.js.org",
                },
                {
                  node: <SiPrisma className="text-[#2d3748]" />,
                  title: "Prisma",
                  href: "https://www.prisma.io",
                },
                {
                  node: <SiPostgresql className="text-[#336791]" />,
                  title: "PostgreSQL",
                  href: "https://www.postgresql.org",
                },
                {
                  node: <SiNodedotjs className="text-[#339933]" />,
                  title: "Node.js",
                  href: "https://nodejs.org",
                },
                {
                  node: <SiCloudflare className="text-[#f38020]" />,
                  title: "Cloudflare",
                  href: "https://www.cloudflare.com",
                },
                {
                  node: <SiVercel className="text-white" />,
                  title: "Vercel",
                  href: "https://vercel.com",
                },
                {
                  node: <SiGit className="text-[#f05032]" />,
                  title: "Git",
                  href: "https://git-scm.com",
                },
                {
                  node: <SiGithub className="text-white" />,
                  title: "GitHub",
                  href: "https://github.com",
                },
                {
                  node: <SiFigma className="text-[#f24e1e]" />,
                  title: "Figma",
                  href: "https://www.figma.com",
                },
                {
                  node: <SiVitest className="text-[#729b1b]" />,
                  title: "Vitest",
                  href: "https://vitest.dev",
                },
                {
                  node: <SiJest className="text-[#c21325]" />,
                  title: "Jest",
                  href: "https://jestjs.io",
                },
              ]}
              speed={80}
              direction="left"
              logoHeight={56}
              gap={40}
              hoverSpeed={20}
              scaleOnHover
              fadeOut
              fadeOutColor="#0a0a0f"
              ariaLabel="Tecnologías y herramientas"
              className="h-20"
            />
          </div>
          {/* Paleta anterior: grid con skillicons.dev usando Image components */}
        </motion.div>
      </div>
    </section>
  );
}
