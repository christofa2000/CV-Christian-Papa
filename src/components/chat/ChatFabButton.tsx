"use client";

import { useChatOpen } from "@/context/ChatOpenContext";
import { MessageCircle } from "lucide-react";

export default function ChatFabButton() {
  const { toggleChat, isChatOpen } = useChatOpen();

  return (
    <button
      type="button"
      aria-label={isChatOpen ? "Cerrar chat" : "Abrir chat"}
      aria-expanded={isChatOpen}
      aria-haspopup="dialog"
      onClick={toggleChat}
      className="
        fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
        rounded-full bg-blue-600 text-white shadow-lg
        p-4 hover:bg-blue-500 active:bg-blue-700
        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950
      "
    >
      <MessageCircle size={24} aria-hidden />
    </button>
  );
}
