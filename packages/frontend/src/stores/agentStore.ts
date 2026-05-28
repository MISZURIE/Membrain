import { create } from 'zustand';
import api from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  memoriesUsed?: string[];
  tokenCount?: number;
}

interface AgentState {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  messages: [],
  sessionId: `session_${Date.now()}`,
  isLoading: false,

  sendMessage: async (message: string) => {
    const { sessionId, messages } = get();

    // Add user message immediately
    set({
      messages: [...messages, { role: 'user', content: message }],
      isLoading: true,
    });

    try {
      const response = await api.post('/api/agent/chat', { message, sessionId });
      const { reply, memoryUsed, tokenCount } = response.data;

      set((state) => ({
        messages: [
          ...state.messages,
          { role: 'assistant', content: reply, memoriesUsed: memoryUsed, tokenCount },
        ],
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        messages: [
          ...state.messages,
          { role: 'assistant', content: '[Error] Failed to get a response from MemBrain.' },
        ],
        isLoading: false,
      }));
    }
  },

  clearMessages: () => set({ messages: [], sessionId: `session_${Date.now()}` }),
}));
