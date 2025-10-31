"use client";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const reduced = useReducedMotion();

  // Estado visual para CSS
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-chat-state", open ? "open" : "closed");
    return () => root.removeAttribute("data-chat-state");
  }, [open]);

  // Focus trap básico + retorno de foco al botón
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current!;
    const btn = btnRef.current;
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    setTimeout(
      () =>
        iframeRef.current?.contentWindow
          ? iframeRef.current.focus()
          : dialog.focus(),
      0
    );

    return () => {
      document.removeEventListener("keydown", onKey);
      if (btn) btn.focus();
    };
  }, [open]);

  // Notificar al iframe que inicialice el modelo sólo cuando se abre
  useEffect(() => {
    if (!open || !iframeRef.current) return;
    const id = setTimeout(
      () => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "cvchris:init-engine" },
          "*"
        );
      },
      reduced ? 0 : 150
    );
    return () => clearTimeout(id);
  }, [open, reduced]);

  // Ocultar en iframe
  if (typeof window !== "undefined" && window.self !== window.top) return null;

  return (
    <>
      {/* Botón flotante — ajustá padding y posición acá */}
      <button
        ref={btnRef}
        type="button"
        aria-label="Abrir chat"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-chat-button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-6 right-6 md:bottom-8 md:right-8
          rounded-full bg-blue-700 text-white shadow-lg
          px-5 py-3  /* <= padding del botón */
          hover:bg-blue-600 active:bg-blue-800
          transition focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2
        "
      >
        ChrisBot
      </button>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat sobre el portfolio de Christian"
          className="chat-overlay fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Contenedor del modal — ajustá ancho/alto acá */}
          <div
            className="
              chat-content mx-auto mt-12
              w-[min(100%,42rem)]  /* <= ancho del panel */
              h-[82vh]            /* <= alto del panel */
              rounded-2xl border border-white/10 bg-neutral-950 text-neutral-100 shadow-2xl
              overflow-hidden
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 px-5 py-3 bg-neutral-950/80 backdrop-blur">
              <h2 className="text-sm font-semibold tracking-wide">
                ChrisBot a la orden.
              </h2>
              <button
                type="button"
                aria-label="Cerrar chat"
                onClick={() => setOpen(false)}
                className="
                  inline-flex items-center justify-center rounded-md
                  px-2.5 py-1.5 text-sm
                  hover:bg-white/5
                  focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2
                "
              >
                ✕
              </button>
            </header>

            {/* Área de contenido */}
            <iframe
              ref={iframeRef}
              src="/chat?defer=1"
              title="Chat"
              className="flex-1 w-full"
              tabIndex={0}
            />
          </div>
        </div>
      )}
    </>
  );
}
