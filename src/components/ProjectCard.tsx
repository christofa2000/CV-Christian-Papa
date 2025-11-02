"use client";

import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const isMuseoDelTiempo = project.id === "museo-del-tiempo";

  // Device images mapping para Museo del Tiempo
  const deviceImages = {
    pc: "/api-museo-del-tiempo-pc.png",
    tablet: "/api-museo-del-tiempo-tablet.png",
    cel: "/api-museo-del-tiempo-cel.png",
  } as const;

  const deviceLabels = {
    pc: "PC",
    tablet: "Tablet",
    cel: "Móvil",
  } as const;

  const deviceIcons = {
    pc: Monitor,
    tablet: Tablet,
    cel: Smartphone,
  } as const;

  type DeviceType = keyof typeof deviceImages;

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const controls = useAnimation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controls.start(inView ? "show" : "hidden");
  }, [inView, controls]);

  // Función para navegar entre dispositivos
  const navigateDevice = (direction: "prev" | "next") => {
    if (!selectedDevice) return;

    const devices: DeviceType[] = ["pc", "tablet", "cel"];
    const currentIndex = devices.indexOf(selectedDevice);

    if (direction === "prev") {
      const prevIndex =
        currentIndex === 0 ? devices.length - 1 : currentIndex - 1;
      setSelectedDevice(devices[prevIndex]);
    } else {
      const nextIndex =
        currentIndex === devices.length - 1 ? 0 : currentIndex + 1;
      setSelectedDevice(devices[nextIndex]);
    }
  };

  // Cerrar modal con Escape y navegación con flechas
  useEffect(() => {
    if (!selectedDevice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDevice(null);
        return;
      }

      // Navegación con flechas del teclado
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const devices: DeviceType[] = ["pc", "tablet", "cel"];
        const currentIndex = devices.indexOf(selectedDevice);
        const prevIndex =
          currentIndex === 0 ? devices.length - 1 : currentIndex - 1;
        setSelectedDevice(devices[prevIndex]);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const devices: DeviceType[] = ["pc", "tablet", "cel"];
        const currentIndex = devices.indexOf(selectedDevice);
        const nextIndex =
          currentIndex === devices.length - 1 ? 0 : currentIndex + 1;
        setSelectedDevice(devices[nextIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedDevice]);

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
            {isMuseoDelTiempo ? (
              // Botones de dispositivos para Museo del Tiempo
              <>
                {(Object.keys(deviceImages) as DeviceType[]).map((device) => {
                  const Icon = deviceIcons[device];
                  return (
                    <button
                      key={device}
                      onClick={() => setSelectedDevice(device)}
                      className="p-3 bg-white text-neutral-900 rounded-full hover:bg-blue-700 hover:text-white transition-colors focus-ring"
                      aria-label={`Ver proyecto en ${deviceLabels[device]}`}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </>
            ) : (
              // Botones normales para otros proyectos
              <>
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
              </>
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

      {/* Modal para mostrar imagen grande de Museo del Tiempo */}
      <AnimatePresence>
        {isMuseoDelTiempo && selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedDevice(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Vista del proyecto en ${deviceLabels[selectedDevice]}`}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-[95vw] h-[95vh] max-w-7xl max-h-[90vh] bg-neutral-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
                <h3 className="text-lg font-semibold text-neutral-200">
                  {project.title} - {deviceLabels[selectedDevice]}
                </h3>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="p-2 rounded-full hover:bg-neutral-800 transition-colors focus-ring"
                  aria-label="Cerrar"
                >
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>

              {/* Contenedor de imagen con flechas de navegación */}
              <div className="flex-1 relative flex flex-col min-h-0">
                {/* Flecha izquierda */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateDevice("prev");
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors focus-ring border border-white/20"
                  aria-label="Dispositivo anterior"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>

                {/* Flecha derecha */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateDevice("next");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors focus-ring border border-white/20"
                  aria-label="Siguiente dispositivo"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>

                {/* Contenedor de imagen con scroll para celular */}
                {selectedDevice === "cel" ? (
                  // Para celular: contenedor con scroll vertical que simula tamaño de celular
                  <div
                    className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden flex items-start justify-center py-8"
                    style={{ height: "100%" }}
                  >
                    <div className="w-full max-w-sm md:max-w-md">
                      <img
                        src={deviceImages[selectedDevice]}
                        alt={`${project.title} visto en ${deviceLabels[selectedDevice]}`}
                        className="w-full h-auto block mx-auto"
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  // Para PC y Tablet: usar fill para ajustar al contenedor
                  <div className="flex-1 min-h-0 overflow-auto w-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={deviceImages[selectedDevice]}
                        alt={`${project.title} visto en ${deviceLabels[selectedDevice]}`}
                        fill
                        className="object-contain"
                        sizes="95vw"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
