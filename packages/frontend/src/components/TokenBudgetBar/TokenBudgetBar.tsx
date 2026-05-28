/**
 * TokenBudgetBar — Real-time token usage meter component.
 * Shows: 🟢 < 50% / 🟡 50–80% / 🔴 > 80%
 */

interface TokenBudgetBarProps {
  used: number;
  total: number;
  percentage: number;
  health: 'green' | 'yellow' | 'red';
}

export default function TokenBudgetBar({ used, total, percentage, health }: TokenBudgetBarProps) {
  const colorMap = {
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const healthEmoji = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴',
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          {healthEmoji[health]} Token Budget
        </span>
        <span className="text-sm text-gray-400">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[health]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{percentage}% utilized</p>
    </div>
  );
}
