"use client";

import { slideInFromLeft, slideInFromRight } from "@/lib/motion";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  technologies: string[];
  side: "left" | "right";
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isLeft = project.side === "left";
  const animationVariant = isLeft ? slideInFromLeft : slideInFromRight;

  return (
    <motion.article
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={animationVariant}
      className={`grid lg:grid-cols-2 gap-8 items-center ${
        isLeft ? "" : "lg:grid-flow-col-dense"
      }`}
    >
      {/* Imagen */}
      <motion.div
        className={`relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-lg ${
          isLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <Image
          src={project.image}
          alt={`Screenshot del proyecto ${project.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                className="p-3 bg-white text-neutral-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors focus-ring"
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
                aria-label={`Ver código de ${project.title}`}
              >
                <Github size={20} />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contenido */}
      <motion.div
        className={`space-y-6 ${isLeft ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="space-y-4">
          <h3 className="text-3xl font-semibold text-neutral-200">
            {project.title}
          </h3>
          <p className="text-lg text-neutral-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
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

        {/* Links */}
        <div className="flex flex-wrap gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors focus-ring"
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
