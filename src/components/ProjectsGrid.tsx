"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string; // ✅ 1 sola foto por proyecto
  demoUrl?: string;
  repoUrl?: string;
  technologies: string[];
  highlights?: string[];
}

const projects: Project[] = [
  {
    id: "juegotenis",
    title: "Juego Tenis",
    description:
      "Plataforma web para clubes y academias de tenis orientada a la gestión de clases, sedes y comunicación con alumnos. Desarrollada con foco en experiencia de usuario, diseño moderno y performance, incluyendo animaciones sutiles y una arquitectura frontend escalable.",
    image: "/juegotenis.png",
    demoUrl: "https://juegotenis.vercel.app/",
    repoUrl: "https://github.com/christofa2000/Juegotenis.git",
    technologies: [
      "Next.js (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Responsive Design",
    ],
  },
  {
    id: "zapatillas",
    title: "Ecommerce Zapatillas",
    description:
      "Sitio de comercio electrónico centrado en zapatillas sostenibles, construido con Next.js App Router y un stack moderno orientado a SEO, accesibilidad e internacionalización. Incluye catálogo mockeado, carrito persistente con Zustand y UI animada con Framer Motion + Tailwind 4.",
    image: "/ecommerse.png",
    demoUrl: "https://ecommerse-zapas.vercel.app/es/",
    repoUrl: "https://github.com/christofa2000/Ecommerse-zapas",
    technologies: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Zustand",
      "Framer Motion",
      "Radix UI",
      "Lucide Icons",
      "Jest",
      "Testing Library",
      "Playwright",
    ],
    highlights: [
      "🌐 Internacionalización con /[lang] y middleware Accept-Language.",
      "🛒 Carrito global y persistente con Zustand.",
      "🎨 Animaciones y UI moderna con Tailwind 4 + Framer Motion.",
      "🔍 SEO dinámico: metadata, JSON-LD, sitemap, robots.",
      "🧪 Tests unitarios y E2E (Jest + Playwright).",
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
    id: "museo-del-tiempo",
    title: "Museo del Tiempo",
    description:
      "Aplicación web que consume tres APIs diferentes para ofrecer una experiencia interactiva y educativa. Combina tecnología moderna y curiosidad histórica, permitiendo explorar datos, imágenes y eventos de distintas épocas a través de una interfaz intuitiva y dinámica.",
    image: "/api.png",
    demoUrl: "https://api-museo-del-tiempo.vercel.app/",
    repoUrl: "https://github.com/christofa2000/API-Museo-del-tiempo",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "APIs públicas (iTunes, Wikipedia, Art Institute of Chicago)",
    ],
  },
];

export default function ProjectsGrid() {
  const fadeOnly = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <section id="proyectos" className="py-20 md:py-24 bg-neutral-900/50">
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
            className="text-5xl md:text-6xl lg:text-7xl font-semibold text-neutral-200 mb-6"
          >
            Proyectos
          </motion.h2>
          <motion.p
            variants={fadeOnly}
            className="text-xl md:text-2xl lg:text-3xl text-neutral-400 max-w-4xl mx-auto"
          >
            Una selección de proyectos que demuestran mi experiencia en
            desarrollo frontend moderno y mejores prácticas.
          </motion.p>
        </motion.div>

        {/* Lista de proyectos */}
        <div className="space-y-20 md:space-y-24">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
