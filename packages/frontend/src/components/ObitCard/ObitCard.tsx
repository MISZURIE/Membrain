/**
 * ObitCard — Displays a single Memory Obituary card.
 * Shows the ultra-compressed summary of a deleted memory.
 */

interface ObitCardProps {
  id: string;
  summary: string;
  originalTokens: number;
  summaryTokens: number;
  compressionRatio: number;
  deletedAt: string;
}

export default function ObitCard({ summary, originalTokens, summaryTokens, compressionRatio, deletedAt }: ObitCardProps) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0">🪦</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span>📦 {originalTokens} → {summaryTokens} tokens</span>
            <span>📐 {compressionRatio.toFixed(1)}x compressed</span>
            <span>🗓️ {new Date(deletedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
