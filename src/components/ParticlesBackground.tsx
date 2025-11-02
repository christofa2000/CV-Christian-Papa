"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

interface ParticlesBackgroundProps {
  particleCount?: number;
  particleColors?: string[];
  connectionDistance?: number;
  particleSpeed?: number;
  opacity?: number;
}

export default function ParticlesBackground({
  particleCount = 80,
  particleColors = ["#1d4ed8", "#3b82f6", "#2563eb", "#1e40af"],
  connectionDistance = 150,
  particleSpeed = 0.3,
  opacity = 0.4,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const oldWidth = canvas.width || window.innerWidth;
      const oldHeight = canvas.height || window.innerHeight;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      // Scale existing particles to new dimensions if they exist
      if (particlesRef.current.length > 0 && oldWidth > 0 && oldHeight > 0) {
        const scaleX = width / oldWidth;
        const scaleY = height / oldHeight;

        particlesRef.current.forEach((p) => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = (): Particle[] => {
      const particles: Particle[] = [];
      const width = canvas.width || window.innerWidth;
      const height = canvas.height || window.innerHeight;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius: Math.random() * 2 + 1,
          color:
            particleColors[Math.floor(Math.random() * particleColors.length)] ||
            "#1d4ed8",
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      return particles;
    };

    particlesRef.current = initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Keep particles in bounds
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Mouse interaction (subtle attraction/repulsion)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = (100 - distance) / 100;
          p.vx -= (dx / distance) * force * 0.01;
          p.vy -= (dy / distance) * force * 0.01;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * opacity;
        ctx.fill();
      }

      // Draw connections
      ctx.globalAlpha = opacity * 0.2;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const lineOpacity = (1 - distance / connectionDistance) * 0.3;
            ctx.strokeStyle = particleColors[0] || "#1d4ed8";
            ctx.globalAlpha = lineOpacity * opacity;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isClient,
    prefersReduced,
    particleCount,
    particleColors,
    connectionDistance,
    particleSpeed,
    opacity,
  ]);

  // Don't render canvas if reduced motion is preferred
  if (prefersReduced || !isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}
