/**
 * ForgettingModal — HITL checkpoint modal component.
 * Displays proposed memory deletions for user approval.
 */

interface Proposal {
  id: string;
  memoryId: string;
  content: string;
  tidScore: number;
  reason: string;
}

interface ForgettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: Proposal[];
  onApproveAll: () => void;
  onKeepAll: () => void;
  onApprove: (proposalId: string) => void;
  onReject: (proposalId: string) => void;
}

export default function ForgettingModal({
  isOpen,
  onClose,
  proposals,
  onApproveAll,
  onKeepAll,
  onApprove,
  onReject,
}: ForgettingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">🗑️ Forgetting Checkpoint</h2>
          <p className="text-sm text-gray-500 mt-1">
            I propose forgetting {proposals.length} memor{proposals.length === 1 ? 'y' : 'ies'}. Here's why:
          </p>
        </div>

        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-3">
          {proposals.map((p) => (
            <div key={p.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3">
              <p className="text-sm text-gray-300">{p.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Score: <span className="text-red-400 font-mono">{p.tidScore.toFixed(2)}</span> — {p.reason.replace('_', ' ')}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => onReject(p.id)} className="text-xs px-2 py-1 text-emerald-400 hover:bg-emerald-500/10 rounded">Keep</button>
                  <button onClick={() => onApprove(p.id)} className="text-xs px-2 py-1 text-red-400 hover:bg-red-500/10 rounded">Forget</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          <button onClick={onKeepAll} className="px-4 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-lg text-sm hover:bg-emerald-500/25 transition-colors">
            Keep All
          </button>
          <button onClick={onApproveAll} className="px-4 py-2 bg-red-500/15 text-red-400 border border-red-500/25 rounded-lg text-sm hover:bg-red-500/25 transition-colors">
            Approve All
          </button>
        </div>
      </div>
    </div>
  );
}
