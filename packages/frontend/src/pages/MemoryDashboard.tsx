import { useEffect, useState } from 'react';
import { useMemoryStore } from '../stores/memoryStore';

/**
 * MemoryDashboard — Displays the D3.js memory tree visualization
 * and memory statistics.
 */
export default function MemoryDashboard() {
  const { memories, stats, fetchMemories, fetchStats } = useMemoryStore();
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
    fetchStats();
  }, [fetchMemories, fetchStats]);

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-emerald-400';
    if (score >= 0.4) return 'text-yellow-400';
    if (score >= 0.15) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.7) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 0.4) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 0.15) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Memory Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Inspect and manage your memory nodes</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active Memories</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.activeMemories}</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Deleted</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">{stats.deletedMemories}</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Tokens</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.totalTokens.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Avg TID Score</p>
          <p className={`text-2xl font-bold mt-1 ${getScoreColor(stats.avgTidScore)}`}>
            {stats.avgTidScore.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Memory Tree Placeholder + Memory List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D3.js Tree Visualization Placeholder */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-gray-500 space-y-2">
            <div className="text-4xl">🌳</div>
            <p className="font-medium">Memory Tree Visualization</p>
            <p className="text-xs">D3.js radial tree will render here</p>
          </div>
        </div>

        {/* Memory Node List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {memories.length === 0 ? (
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-8 text-center text-gray-500">
              No memories yet. Start a conversation to create memory nodes.
            </div>
          ) : (
            memories.map((memory) => (
              <button
                key={memory.id}
                onClick={() => setSelectedMemory(selectedMemory === memory.id ? null : memory.id)}
                className={`w-full text-left ${getScoreBg(memory.tidScore)} border rounded-xl p-4 transition-all hover:opacity-80`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-200 line-clamp-2 flex-1">{memory.content}</p>
                  <span className={`text-sm font-mono font-bold whitespace-nowrap ${getScoreColor(memory.tidScore)}`}>
                    {memory.tidScore.toFixed(2)}
                  </span>
                </div>
                {selectedMemory === memory.id && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50 grid grid-cols-3 gap-2 text-xs text-gray-400">
                    <div>Recency: <span className="text-white">{memory.recencyScore.toFixed(2)}</span></div>
                    <div>Goal: <span className="text-white">{memory.goalScore.toFixed(2)}</span></div>
                    <div>Noise: <span className="text-white">{memory.noiseScore.toFixed(2)}</span></div>
                    <div>Tokens: <span className="text-white">{memory.contentTokens}</span></div>
                    <div>Accesses: <span className="text-white">{memory.accessCount}</span></div>
                    <div>Status: <span className="text-white">{memory.status}</span></div>
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
