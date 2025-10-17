"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { name: "Sobre mí", href: "#sobre-mi" },
  { name: "Proyectos", href: "#proyectos" },
  { name: "Contacto", href: "#contacto" },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  // Scroll: ocultar en down, mostrar en up
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastYRef.current;
        const threshold = 6; // evita flicker
        if (Math.abs(delta) > threshold) {
          setHidden(delta > 0 && y > 64); // esconder si baja y ya pasó el hero top
          lastYRef.current = y;
        }
        tickingRef.current = false;
      });
      tickingRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Skip Link */}
      <a
        href="#content"
        className="absolute -top-10 left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-md transition-transform focus-ring"
        onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth" })}
      >
        Saltar al contenido principal
      </a>

      {/* NavBar (transparente, sticky, hide-on-scroll) */}
      <motion.nav
        initial={false}
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="
          sticky top-0 left-0 right-0 z-40
          bg-transparent
        "
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* (Sin logo/título) */}

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-1 items-center justify-center">
              {/* gap para separar las píldoras */}
              <div className="relative flex items-center gap-6">
                {navItems.map((item) => {
                  const isActive = activeSection === item.href.replace("#", "");
                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className={`relative px-5 py-2 text-sm font-medium rounded-full border transition-colors focus-ring
                        ${
                          isActive
                            ? "text-white border-white/15 bg-white/10"
                            : "text-neutral-300 hover:text-neutral-100 border-white/10 hover:bg-white/10"
                        }`}
                    >
                      {/* Fondo animado de la píldora activa */}
                      {isActive && (
                        <motion.span
                          layoutId="activePill"
                          className="absolute inset-0 rounded-full bg-indigo-600/25"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                          aria-hidden
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 focus-ring text-neutral-300 hover:text-neutral-200"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir/Cerrar menú móvil"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (ligeramente translúcido para legibilidad) */}
        <motion.div
          id="mobile-menu"
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="md:hidden overflow-hidden bg-neutral-950/70 backdrop-blur-sm border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-5 py-2 text-sm font-medium rounded-full transition-colors focus-ring border
                    ${
                      isActive
                        ? "text-white bg-indigo-600/30 border-white/10"
                        : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60 border-white/10"
                    }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
