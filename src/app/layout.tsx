import IntroGate from "@/components/IntroGate";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    url: "https://christianpapa.dev",
    title: "Christian Oscar Papa — Frontend React + TypeScript",
    description:
      "CV/Portfolio con intro animada, accesible y de alto rendimiento.",
    siteName: "Christian Papa Portfolio",
    images: [
      {
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-neutral-950 text-neutral-200 antialiased selection:bg-indigo-500/30 overflow-x-hidden">
        <IntroGate>
          <main id="content" tabIndex={-1}>
            {children}
          </main>
        </IntroGate>
      </body>
    </html>
  );
}
