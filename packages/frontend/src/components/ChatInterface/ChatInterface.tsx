/**
 * ChatInterface — Reusable chat input/message display component.
 * Used by ChatPage for the main conversation UI.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function ChatInterface({ messages, onSend, isLoading, placeholder }: ChatInterfaceProps) {
  // This is a reusable wrapper; primary implementation is in ChatPage.
  // Kept as a component stub for future extraction.
  return null;
}
