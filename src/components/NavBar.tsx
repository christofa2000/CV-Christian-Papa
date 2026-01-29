"use client";

import { useChatOpen } from "@/context/ChatOpenContext";
import { motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Sobre mí", href: "#sobre-mi" },
  { name: "Proyectos", href: "#proyectos" },
  { name: "Contacto", href: "#contacto" },
];

export default function NavBar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleChat, isChatOpen } = useChatOpen();

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
      {/* Skip Link accesible */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:-top-10 focus:left-4 focus:z-[100] focus:bg-blue-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:transition-transform focus-ring"
        onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: "smooth" })}
      >
        Saltar al contenido principal
      </a>

      {/* NAV: estático, sin posicionamiento fijo */}
      <nav className="relative w-full bg-transparent">
        <div className="mx-auto max-w-6xl md:max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-center">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`px-5 py-2 text-sm font-medium rounded-full border transition-colors focus-ring
                      ${
                        isActive
                          ? "text-white border-white/15 bg-white/10"
                          : "text-neutral-300 hover:text-neutral-100 border-white/10 hover:bg-white/10"
                      }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={toggleChat}
                aria-label={isChatOpen ? "Cerrar chat" : "Abrir chat"}
                aria-expanded={isChatOpen}
                className={`px-5 py-2 text-sm font-medium rounded-full border transition-colors focus-ring flex items-center gap-2
                  ${
                    isChatOpen
                      ? "text-white border-white/15 bg-white/10"
                      : "text-neutral-300 hover:text-neutral-100 border-white/10 hover:bg-white/10"
                  }`}
              >
                <MessageCircle size={18} aria-hidden />
                Chat
              </button>
            </div>

            {/* Mobile toggle */}
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

          {/* Mobile Menu */}
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
                          ? "text-white bg-blue-700/30 border-white/10"
                          : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60 border-white/10"
                      }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  toggleChat();
                  setIsMobileMenuOpen(false);
                }}
                aria-label={isChatOpen ? "Cerrar chat" : "Abrir chat"}
                className="flex w-full items-center gap-2 text-left px-5 py-2 text-sm font-medium rounded-full transition-colors focus-ring border text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60 border-white/10"
              >
                <MessageCircle size={18} aria-hidden />
                Chat
              </button>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
}
