import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const TABS = ['Today', 'This Week', 'All Time'];

const RANK_COLORS: Record<number, string> = {
  1: 'bg-brand-gold text-brand-ink font-black',
  2: 'bg-slate-300 text-brand-ink font-bold',
  3: 'bg-amber-700 text-white font-bold',
};

export default function OverallLeaderboard() {
  const [activeTab, setActiveTab] = useState('All Time');
  const { nominees } = useVote();

  // Top 5 nominees sorted by votes
  const topNominees = [...nominees].slice(0, 5);

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

      {topNominees.length === 0 ? (
        <p className="text-xs text-brand-ink/50 text-center py-4">No participants registered yet.</p>
      ) : (
        <ul className="space-y-3">
          {topNominees.map((entry, idx) => {
            const rank = idx + 1;
            return (
              <li key={entry.id} className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                    RANK_COLORS[rank] ?? 'bg-black/5 text-brand-ink/60 font-semibold'
                  }`}
                >
                  {rank}
                </span>
                <img
                  src={entry.img || '/cat_rider_awards.jpg'}
                  alt={entry.name}
                  className="w-8 h-8 rounded-full object-cover border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-ink truncate">{entry.name}</p>
                  <p className="text-xs text-brand-ink/45 truncate">{entry.categoryName}</p>
                </div>
                <span className="text-sm font-bold text-brand-green shrink-0">{entry.votes.toLocaleString()}</span>
              </li>
            );
          })}
        </ul>
      )}

      <a
        href="/live-results"
        className="mt-4 block text-center text-sm font-semibold text-brand-green border border-brand-green/30 rounded-lg py-2 hover:bg-brand-green hover:text-white transition-colors"
      >
        View Full Leaderboard
      </a>
    </div>
  );
}
