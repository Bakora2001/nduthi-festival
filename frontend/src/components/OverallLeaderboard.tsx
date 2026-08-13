import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { leaderboard } from '../data/mockData';

const TABS = ['Today', 'This Week', 'All Time'];

const RANK_COLORS: Record<number, string> = {
  1: 'bg-brand-gold text-brand-ink',
  2: 'bg-slate-300 text-brand-ink',
  3: 'bg-amber-700 text-white',
};

export default function OverallLeaderboard() {
  const [activeTab, setActiveTab] = useState('Today');

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-brand-gold-dark" />
        <h3 className="font-display text-base font-bold text-brand-ink">Overall Leaderboard</h3>
      </div>

      <div className="flex gap-1.5 mb-4 bg-black/[0.03] p-1 rounded-lg">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors ${
              activeTab === tab ? 'bg-brand-green text-white shadow-card' : 'text-brand-ink/60 hover:text-brand-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {leaderboard.map((entry) => (
          <li key={entry.rank} className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                RANK_COLORS[entry.rank] ?? 'bg-black/5 text-brand-ink/60'
              }`}
            >
              {entry.rank}
            </span>
            <span className="w-8 h-8 rounded-full bg-brand-green-light shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-brand-ink truncate">{entry.name}</p>
              <p className="text-xs text-brand-ink/45 truncate">{entry.category}</p>
            </div>
            <span className="text-sm font-bold text-brand-green shrink-0">{entry.votes.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <a
        href="/live-results"
        className="mt-4 block text-center text-sm font-semibold text-brand-green border border-brand-green/30 rounded-lg py-2 hover:bg-brand-green hover:text-white transition-colors"
      >
        View Full Leaderboard
      </a>
    </div>
  );
}
