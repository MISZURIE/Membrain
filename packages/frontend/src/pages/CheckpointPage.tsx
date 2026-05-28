import { useEffect } from 'react';
import { useMemoryStore } from '../stores/memoryStore';

/**
 * CheckpointPage — Human-in-the-Loop forgetting approval UI.
 * Shows pending forgetting proposals and lets the user Approve All / Review Each / Keep All.
 */
export default function CheckpointPage() {
  const { checkpoints, fetchCheckpoints, approveAll, approveProposal, rejectProposal } = useMemoryStore();

  useEffect(() => {
    fetchCheckpoints();
  }, [fetchCheckpoints]);

  const pendingCheckpoints = checkpoints.filter((c) => c.status === 'PENDING');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Forgetting Checkpoint</h1>
        <p className="text-gray-500 text-sm mt-1">Review proposed memory deletions before they are permanently forgotten</p>
      </div>

      {pendingCheckpoints.length === 0 ? (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-white">No pending checkpoints</h3>
          <p className="text-gray-500 text-sm mt-2">
            All your memories are healthy. Forgetting proposals will appear here when memory scores drop below threshold.
          </p>
        </div>
      ) : (
        pendingCheckpoints.map((checkpoint) => (
          <div key={checkpoint.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl overflow-hidden">
            {/* Checkpoint Header */}
            <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white">
                  Checkpoint — {checkpoint.proposals.length} proposal{checkpoint.proposals.length !== 1 ? 's' : ''}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Expires: {new Date(checkpoint.expiresAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  id={`approve-all-${checkpoint.id}`}
                  onClick={() => approveAll(checkpoint.id)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors"
                >
                  Approve All
                </button>
                <button
                  id={`keep-all-${checkpoint.id}`}
                  onClick={() => {
                    checkpoint.proposals.forEach((p) => rejectProposal(p.id));
                  }}
                  className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                >
                  Keep All
                </button>
              </div>
            </div>

            {/* Proposals */}
            <div className="divide-y divide-gray-700/30">
              {checkpoint.proposals.map((proposal) => (
                <div key={proposal.id} className="p-4 flex items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{proposal.memoryContent || 'Memory content'}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>Score: <span className="text-red-400 font-mono">{proposal.tidScore.toFixed(2)}</span></span>
                      <span>Reason: <span className="text-gray-400">{proposal.reason.replace('_', ' ')}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approveProposal(proposal.id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                    >
                      Forget
                    </button>
                    <button
                      onClick={() => rejectProposal(proposal.id)}
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors"
                    >
                      Keep
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
