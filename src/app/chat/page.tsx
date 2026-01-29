import ChatContent from "@/components/chat/ChatContent";

/** Página /chat: acceso directo por URL. El flujo normal usa el sidebar (FAB). */
export default function ChatPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 min-h-screen">
      <ChatContent />
    </div>
  );
}
