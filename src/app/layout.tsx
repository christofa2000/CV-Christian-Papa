import ChatFabButton from "@/components/chat/ChatFabButton";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { ChatOpenProvider } from "@/context/ChatOpenContext";
import IntroGate from "@/components/IntroGate";
import ParticlesBackground from "@/components/ParticlesBackground";
import type { Metadata } from "next";
import "@/components/LogoLoop.css";
import "./globals.css";

/** URL base del sitio: en local usa localhost, en prod lee NEXT_PUBLIC_SITE_URL */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  /** 👇 Evita el warning de Next y resuelve OG/Twitter correctamente */
  metadataBase: new URL(siteUrl),
  title: "Christian Oscar Papa — Frontend React + TypeScript",
  description:
    "CV/Portfolio con intro animada, accesible y de alto rendimiento.",
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Web Development",
  ],
  authors: [{ name: "Christian Oscar Papa" }],
  creator: "Christian Oscar Papa",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    title: "Christian Oscar Papa — Frontend React + TypeScript",
    description:
      "CV/Portfolio con intro animada, accesible y de alto rendimiento.",
    siteName: "Christian Papa Portfolio",
    images: [
      {
        /** Con metadataBase, /og.jpg resuelve a {siteUrl}/og.jpg */
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Christian Oscar Papa - Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Oscar Papa — Frontend React + TypeScript",
    description:
      "CV/Portfolio con intro animada, accesible y de alto rendimiento.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  /** (Opcional) Favicon e iconos si los tenés en /app o /public */
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="relative min-h-screen bg-neutral-950 text-neutral-200 antialiased selection:bg-blue-600/30 overflow-x-hidden">
        {/* 🔮 Fondo global tipo "Electric Motion Blur" */}
        <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
          {/* Capa base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120a26] to-black" />

          {/* Aura conic-gradient giratoria - completamente circular y suavizada */}
          <div
            className="absolute -inset-[25%] blur-3xl opacity-15 animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, #1d4ed8, #14b8a6, #2563eb, #1d4ed8)",
              borderRadius: "50%",
              width: "150%",
              height: "150%",
              left: "-25%",
              top: "-25%",
            }}
          />

          {/* Fondo de partículas */}
          <ParticlesBackground
            particleCount={200}
            particleColors={["#1d4ed8", "#3b82f6", "#2563eb", "#1e40af"]}
            connectionDistance={180}
            particleSpeed={0.3}
            opacity={0.7}
          />

          {/* Textura grain */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 .25 .45 .25 0 0 0 0'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />
        </div>

        {/* Contenido */}
        <ChatOpenProvider>
          <IntroGate>
            <main id="content" tabIndex={-1}>
              {children}
            </main>
          </IntroGate>

          {/* Chat: sidebar + FAB — estado en memoria, no navega a /chat */}
          <ChatSidebar />
          <ChatFabButton />
        </ChatOpenProvider>

        {/* Frame/borde fijo en los bordes de la pantalla — último en DOM y z-[55] para que NUNCA quede tapado por el contenido al scrollear */}
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none z-[55] border border-neutral-700/80 rounded-none"
          style={{ boxSizing: "border-box" }}
        />
      </body>
    </html>
  );
}
