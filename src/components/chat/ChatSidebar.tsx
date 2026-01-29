"use client";

import { useChatOpen } from "@/context/ChatOpenContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";
import ChatContent from "./ChatContent";

export default function ChatSidebar() {
  const { isChatOpen, closeChat } = useChatOpen();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // ESC cierra
  useEffect(() => {
    if (!isChatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeChat();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isChatOpen, closeChat]);

  // Focus trap: al abrir, focus en botón cerrar; trap Tab
  useEffect(() => {
    if (!isChatOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const closeBtn = closeBtnRef.current;

    const focusables = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const t = setTimeout(() => closeBtn?.focus() ?? first?.focus(), reduced ? 0 : 100);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [isChatOpen, reduced]);

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Overlay: mobile = tap cierra; desktop = pointer-events-none para que la página siga usable */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:pointer-events-none md:bg-transparent md:backdrop-blur-none"
            aria-hidden
            onClick={closeChat}
          />

          {/* Panel: sidebar desktop / drawer mobile */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat sobre el portfolio de Christian"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: reduced ? 0 : 0.3,
              ease: "easeOut",
            }}
            className="
              fixed top-0 right-0 z-[70] h-full
              w-full max-w-[min(100vw,420px)] md:w-[420px]
              bg-neutral-950 border border-neutral-800 border-r-0
              shadow-xl rounded-l-2xl
              flex flex-col overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="shrink-0 flex items-center justify-between border-b border-neutral-800 px-4 py-3 bg-neutral-950">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-100 flex items-center gap-2">
                <MessageCircle size={18} aria-hidden />
                Chat
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Cerrar chat"
                onClick={closeChat}
                className="
                  inline-flex items-center justify-center rounded-lg p-2
                  text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950
                "
              >
                <X size={20} />
              </button>
            </header>

            {/* Body: contenedor flex para que ChatContent pueda fijar footer */}
            <div className="flex-1 min-h-0 flex flex-col px-4 py-3 overflow-hidden">
              <ChatContent />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
