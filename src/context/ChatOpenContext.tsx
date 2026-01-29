"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChatOpenContextValue = {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatOpenContext = createContext<ChatOpenContextValue | null>(null);

export function ChatOpenProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ isChatOpen, openChat, closeChat, toggleChat }),
    [isChatOpen, openChat, closeChat, toggleChat]
  );

  return (
    <ChatOpenContext.Provider value={value}>{children}</ChatOpenContext.Provider>
  );
}

export function useChatOpen(): ChatOpenContextValue {
  const ctx = useContext(ChatOpenContext);
  if (!ctx) {
    throw new Error("useChatOpen must be used within ChatOpenProvider");
  }
  return ctx;
}
