import { create } from 'zustand';
import api from '../lib/api';

interface Memory {
  id: string;
  content: string;
  contentTokens: number;
  tidScore: number;
  recencyScore: number;
  goalScore: number;
  noiseScore: number;
  accessCount: number;
  status: string;
  createdAt: string;
}

interface ForgettingProposal {
  id: string;
  memoryId: string;
  memoryContent?: string;
  tidScore: number;
  reason: string;
  approved: boolean | null;
}

interface Checkpoint {
  id: string;
  status: string;
  expiresAt: string;
  proposals: ForgettingProposal[];
}

interface Stats {
  totalMemories: number;
  activeMemories: number;
  deletedMemories: number;
  totalTokens: number;
  avgTidScore: number;
}

interface MemoryState {
  memories: Memory[];
  stats: Stats;
  checkpoints: Checkpoint[];
  fetchMemories: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCheckpoints: () => Promise<void>;
  approveAll: (checkpointId: string) => Promise<void>;
  approveProposal: (proposalId: string) => Promise<void>;
  rejectProposal: (proposalId: string) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  stats: {
    totalMemories: 0,
    activeMemories: 0,
    deletedMemories: 0,
    totalTokens: 0,
    avgTidScore: 0,
  },
  checkpoints: [],

  fetchMemories: async () => {
    try {
      const response = await api.get('/api/memory');
      set({ memories: response.data.memories });
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    }
  },

  fetchStats: async () => {
    try {
      const response = await api.get('/api/memory/stats');
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  fetchCheckpoints: async () => {
    try {
      const response = await api.get('/api/checkpoint/pending');
      set({ checkpoints: response.data.checkpoints });
    } catch (error) {
      console.error('Failed to fetch checkpoints:', error);
    }
  },

  approveAll: async (checkpointId: string) => {
    try {
      await api.post('/api/checkpoint/approve-all');
      set((state) => ({
        checkpoints: state.checkpoints.filter((c) => c.id !== checkpointId),
      }));
    } catch (error) {
      console.error('Failed to approve all:', error);
    }
  },

  approveProposal: async (proposalId: string) => {
    try {
      await api.post(`/api/checkpoint/${proposalId}/approve`);
    } catch (error) {
      console.error('Failed to approve proposal:', error);
    }
  },

  rejectProposal: async (proposalId: string) => {
    try {
      await api.post(`/api/checkpoint/${proposalId}/reject`);
    } catch (error) {
      console.error('Failed to reject proposal:', error);
    }
  },
}));
