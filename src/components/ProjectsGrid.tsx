"use client";

import { fadeInUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    description:
      "Plataforma de comercio electrónico completa con carrito de compras, pagos integrados y panel de administración. Construida con Next.js, TypeScript y Stripe para una experiencia de compra fluida y segura.",
    image: "/placeholder-project-1.jpg",
    demoUrl: "https://demo-ecommerce.com",
    repoUrl: "https://github.com/christianpapa/ecommerce-platform",
    technologies: ["Next.js", "TypeScript", "Stripe", "Prisma", "Tailwind CSS"],
    side: "left" as const,
  },
  {
    id: "task-management",
    title: "Task Management App",
    description:
      "Aplicación de gestión de tareas con drag & drop, colaboración en tiempo real y notificaciones. Incluye tableros Kanban, asignación de tareas y seguimiento de progreso en equipo.",
    image: "/placeholder-project-2.jpg",
    demoUrl: "https://demo-tasks.com",
    repoUrl: "https://github.com/christianpapa/task-management",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Framer Motion"],
    side: "right" as const,
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
    side: "left" as const,
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "Dashboard meteorológico con mapas interactivos, pronósticos detallados y alertas personalizadas. Integración con APIs meteorológicas y visualizaciones en tiempo real.",
    image: "/placeholder-project-4.jpg",
    demoUrl: "https://demo-weather.com",
    repoUrl: "https://github.com/christianpapa/weather-dashboard",
    technologies: ["React", "D3.js", "OpenWeather API", "Chart.js"],
    side: "right" as const,
  },
  {
    id: "social-media-app",
    title: "Social Media App",
    description:
      "Red social moderna con feed personalizado, mensajería en tiempo real y sistema de seguimiento. Incluye notificaciones push, stories y sistema de likes/comentarios.",
    image: "/placeholder-project-5.jpg",
    demoUrl: "https://demo-social.com",
    repoUrl: "https://github.com/christianpapa/social-app",
    technologies: ["Next.js", "GraphQL", "PostgreSQL", "Redis", "AWS"],
    side: "left" as const,
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description:
      "Panel de análisis de datos con visualizaciones interactivas y reportes automatizados. Dashboard ejecutivo con métricas en tiempo real y exportación de datos.",
    image: "/placeholder-project-6.jpg",
    demoUrl: "https://demo-analytics.com",
    repoUrl: "https://github.com/christianpapa/analytics-dashboard",
    technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
    side: "right" as const,
  },
];

export default function ProjectsGrid() {
  return (
    <section id="proyectos" className="py-24 bg-neutral-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-semibold text-neutral-200 mb-6"
          >
            Proyectos
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-neutral-400 max-w-3xl mx-auto"
          >
            Una selección de proyectos que demuestran mi experiencia en
            desarrollo frontend moderno y mejores prácticas.
          </motion.p>
        </motion.div>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
