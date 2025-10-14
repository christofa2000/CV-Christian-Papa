"use client";

import AboutMe from "@/components/AboutMe";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import NavBar from "@/components/NavBar";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function Home() {
  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <Hero />

      {/* About Me Section */}
      <AboutMe />

      {/* Projects Section */}
      <ProjectsGrid />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-500">
            © 2024 Christian Oscar Papa. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
