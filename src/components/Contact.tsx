"use client";

import { fadeInUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail } from "lucide-react";

const contactLinks = [
  {
    name: "Email",
    href: "mailto:christian.papa@email.com",
    icon: Mail,
    label: "Enviar email a Christian Papa",
  },
  {
    name: "GitHub",
    href: "https://github.com/christianpapa",
    icon: Github,
    label: "Ver perfil de GitHub de Christian Papa",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/christianpapa",
    icon: Linkedin,
    label: "Ver perfil de LinkedIn de Christian Papa",
  },
];

export default function Contact() {
  return (
    <section id="contacto" className="py-24 bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-semibold text-neutral-200 mb-6"
          >
            Contacto
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-neutral-400 mb-12"
          >
            ¿Tienes un proyecto en mente? Me encantaría escuchar sobre él.
          </motion.p>

          {/* Contact Links */}
          <motion.div
            variants={stagger}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  variants={fadeInUp}
                  href={link.href}
                  target={
                    link.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    link.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={link.label}
                  className="group flex items-center gap-3 px-6 py-4 bg-neutral-800 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 focus-ring"
                >
                  <Icon
                    size={24}
                    className="text-neutral-400 group-hover:text-indigo-400 transition-colors"
                  />
                  <span className="font-medium text-neutral-200 group-hover:text-indigo-400 transition-colors">
                    {link.name}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Download CV Button */}
          <motion.div variants={fadeInUp}>
            <a
              href="/cv-christian-papa.pdf"
              download="CV-Christian-Papa.pdf"
              className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors focus-ring shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Descargar CV
            </a>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 p-6 bg-neutral-800 rounded-2xl border border-white/10 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">
              Disponibilidad
            </h3>
            <p className="text-neutral-400">
              Actualmente disponible para proyectos freelance y oportunidades de
              trabajo remoto. Respuesta garantizada en 24 horas.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
