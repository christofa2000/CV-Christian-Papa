"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: "museo-del-tiempo",
    title: "Museo del Tiempo",
    description:
      "Aplicación web que consume tres APIs diferentes para ofrecer una experiencia interactiva y educativa. Combina tecnología moderna y curiosidad histórica, permitiendo explorar datos, imágenes y eventos de distintas épocas a través de una interfaz intuitiva y dinámica.",
    image: "/api.png",
    demoUrl: "https://museo-del-tiempo.vercel.app/",
    repoUrl: "https://github.com/christofa2000/API-Museo-del-tiempo",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "APIs públicas (iTunes, Wikipedia, Art Institute of Chicago)",
    ],
  },
  {
    id: "motorlider",
    title: "Motorlider",
    description:
      "Plataforma para concesionaria: catálogo de motos, gestión de inventario, financiación y turnos de test ride. Incluye panel administrativo, carga de unidades con imágenes y seguimiento de leads.",
    image: "/motorlider.png",
    // demoUrl: "https://motorlider.tu-dominio.com",
    // repoUrl: "https://github.com/christofa2000/motorlider",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "Cloudinary",
    ],
  },
  {
    id: "credit-cards-lab",
    title: "Credit Cards Lab",
    description:
      "Aplicación bancaria interactiva para gestionar tarjetas de crédito, consultar movimientos y simular compras en tiempo real. Incluye login seguro, dashboard financiero y animaciones suaves con Framer Motion.",
    image: "/tarjeta.png",
    demoUrl: "https://tarjetasprueba.netlify.app/",
    repoUrl: "https://github.com/christofa2000/tarjetas",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Prisma",
      "PostgreSQL",
    ],
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description:
      "Sitio web personal con animaciones fluidas, modo oscuro y optimización SEO avanzada. Diseño responsive con Framer Motion y optimizado para performance y accesibilidad.",
    image: "/placeholder-project-3.jpg",
    demoUrl: "https://christianpapa.dev",
    repoUrl: "https://github.com/christianpapa/portfolio",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
  },
];

export default function ProjectsGrid() {
  const fadeOnly = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section id="proyectos" className="py-32 md:py-36 bg-neutral-900/50">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeOnly}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeOnly}
            className="text-4xl md:text-5xl font-semibold text-neutral-200 mb-6"
          >
            Proyectos
          </motion.h2>
          <motion.p
            variants={fadeOnly}
            className="text-xl text-neutral-400 max-w-3xl mx-auto"
          >
            Una selección de proyectos que demuestran mi experiencia en
            desarrollo frontend moderno y mejores prácticas.
          </motion.p>
        </motion.div>

        {/* Lista de proyectos con más espacio y alternado */}
        <div className="space-y-32 md:space-y-40">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
