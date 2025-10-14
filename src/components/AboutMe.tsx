"use client";

import { fadeInUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Git",
  "Figma",
];

export default function AboutMe() {
  return (
    <section id="sobre-mi" className="py-24 bg-neutral-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Spanish Content */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="text-4xl font-semibold text-neutral-200 mb-6">
              Sobre mí
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Soy un desarrollador frontend apasionado por crear experiencias
              web excepcionales. Con más de 5 años de experiencia en React y
              TypeScript, me especializo en construir aplicaciones modernas,
              accesibles y performantes.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              Mi enfoque se centra en la calidad del código, la experiencia del
              usuario y las mejores prácticas de desarrollo. Disfruto trabajando
              en equipo y siempre estoy aprendiendo nuevas tecnologías.
            </p>

            {/* Skills */}
            <div className="pt-4">
              <h3 className="text-xl font-semibold text-neutral-200 mb-4">
                Tecnologías
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* English Content */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="text-4xl font-semibold text-neutral-200 mb-6">
              About me
            </h2>
            <p className="text-lg text-neutral-400 leading-relaxed">
              I&apos;m a passionate frontend developer focused on creating
              exceptional web experiences. With over 5 years of experience in
              React and TypeScript, I specialize in building modern, accessible,
              and performant applications.
            </p>
            <p className="text-lg text-neutral-400 leading-relaxed">
              My approach centers on code quality, user experience, and
              development best practices. I enjoy working in teams and I&apos;m
              always learning new technologies.
            </p>

            {/* Photo Placeholder */}
            <div className="pt-4">
              <div className="relative w-48 h-48 mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl"></div>
                <div className="relative w-full h-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                  <Image
                    src="/placeholder-avatar.jpg"
                    alt="Christian Oscar Papa - Frontend Developer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 192px"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
