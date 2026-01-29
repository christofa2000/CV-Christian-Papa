"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  technologies: string[];
  highlights?: string[];
  // side?: "left" | "right"; // â† ya no lo usamos para el layout
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  // Alternado por índice: pares => imagen izquierda; impares => imagen derecha
  const isLeft = index % 2 === 0;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    controls.start(inView ? "show" : "hidden");
  }, [inView, controls]);

  // Imagen entra desde su borde natural
  const imageSlide = {
    hidden: { x: isLeft ? -220 : 220, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 14 },
    },
  };

  // Texto entra desde el lado opuesto
  const textSlide = {
    hidden: { x: isLeft ? 220 : -220, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 14, delay: 0.03 },
    },
  };

  return (
    <motion.article
      ref={rootRef}
      initial="hidden"
      animate={controls}
      viewport={{ once: false, amount: 0.3 }}
      className="grid lg:grid-cols-2 gap-12 items-center"
    >
      {/* IMAGEN */}
      <motion.div
        variants={imageSlide}
        className={`group relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-lg
          ${
            isLeft ? "lg:order-1" : "lg:order-2"
          } w-full lg:w-4/5 xl:w-3/4 mx-auto`}
      >
        <Image
          src={project.image}
          alt={`Screenshot del proyecto ${project.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Overlay con botones */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white text-neutral-900 rounded-full hover:bg-blue-700 hover:text-white transition-colors focus-ring"
                aria-label={`Ver demo de ${project.title}`}
              >
                <ExternalLink size={20} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white text-neutral-900 rounded-full hover:bg-neutral-800 hover:text-white transition-colors focus-ring"
                aria-label={`Ver Código de ${project.title}`}
              >
                <Github size={20} />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* TEXTO */}
      <motion.div
        variants={textSlide}
        className={`space-y-6 ${
          isLeft ? "lg:order-2" : "lg:order-1"
        } w-full lg:w-4/5 xl:w-3/4 mx-auto`}
      >
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold text-neutral-200">
            {project.title}
          </h3>
          <p className="text-lg text-neutral-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm font-medium border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors focus-ring"
            >
              <ExternalLink size={16} />
              Ver Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-600 text-neutral-300 font-medium rounded-xl hover:bg-neutral-800 transition-colors focus-ring"
            >
              <Github size={16} />
              Código
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
