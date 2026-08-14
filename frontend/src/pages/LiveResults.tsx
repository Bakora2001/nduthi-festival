import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RefreshCw, Share2, Vote as VoteIcon, ArrowRight } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const RANK_COLORS: Record<number, string> = {
  1: '#F5C542',
  2: '#94A3B8',
  3: '#B45309',
};

export default function LiveResults() {
  const { nominees, categories, totalVotes, castVote, refetchData } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);

  // Auto-refresh countdown
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          refetchData();
          return 10;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [refetchData]);

  const filteredNominees = selectedCatId
    ? nominees.filter((n) => n.categoryId === selectedCatId)
    : nominees;

  const currentCategoryTotalVotes = filteredNominees.reduce((sum, n) => sum + n.votes, 0);

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 180 }}>
        <img src="/hero_flag_bg.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-35 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 52%, rgba(255,255,255,0) 78%)' }} />

        <div className="container-nd relative py-6 z-10">
          <h1 className="font-display font-extrabold leading-[1.05] text-[2.4rem]">
            <span className="text-brand-ink">LIVE </span>
            <span className="text-brand-red">RESULTS & LEADERBOARD</span>
            <span className="inline-flex items-center gap-1.5 ml-3 text-xs font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full align-middle">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" /> LIVE
            </span>
          </h1>
          <p className="mt-2 text-sm text-brand-ink/60 max-w-md leading-relaxed">
            Real-time voting statistics across all categories. Updates live as votes are cast via M-Pesa STK Push.
          </p>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div className="border-b border-black/5 bg-white">
        <div className="container-nd py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon="📊" label="Total Votes Cast" value={totalVotes.toLocaleString()} />
          <StatBox icon="🏍️" label="Registered Participants" value={String(nominees.length)} />
          <StatBox icon="🏆" label="Categories" value={String(categories.length)} />
          <div className="flex flex-col justify-center items-center rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-2.5 text-center">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs font-extrabold text-brand-green">LIVE UPDATES</span>
            </div>
            <p className="text-[11px] text-brand-ink/60 font-semibold">Auto-refresh: {countdown}s</p>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="container-nd py-8 grid lg:grid-cols-[240px_1fr] gap-6">

        {/* LEFT SIDEBAR CATEGORIES */}
        <aside className="hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-[10px] font-extrabold text-brand-ink/50 tracking-widest uppercase mb-3">Categories</h3>
            <ul className="space-y-1">
              <li
                onClick={() => setSelectedCatId(null)}
                className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  selectedCatId === null ? 'bg-brand-green text-white' : 'text-brand-ink/70 hover:bg-black/[0.03]'
                }`}
              >
                All Categories ({nominees.length})
              </li>
              {categories.map((cat) => {
                const count = nominees.filter((n) => n.categoryId === cat.id).length;
                const isSelected = selectedCatId === cat.id;
                return (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-all ${
                      isSelected ? 'bg-brand-green text-white' : 'text-brand-ink/70 hover:bg-black/[0.03]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="opacity-70 text-[10px] shrink-0 ml-1">({count})</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <div className="space-y-6 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-extrabold text-brand-ink tracking-tight uppercase">
                {selectedCatId
                  ? categories.find((c) => c.id === selectedCatId)?.name || 'Category Leaderboard'
                  : 'Overall Leaderboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-ink/55">
              <button onClick={() => refetchData()} className="flex items-center gap-1 hover:text-brand-green transition-colors">
                <RefreshCw size={12} /> Refresh Now
              </button>
            </div>
          </div>

          {filteredNominees.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-black/5 shadow-card">
              <p className="text-xl mb-1">🏁</p>
              <h3 className="font-bold text-sm text-brand-ink">No votes recorded yet for this category</h3>
              <p className="text-xs text-brand-ink/50 mt-1">Be the first to cast a vote!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNominees.map((n, i) => {
                const rank = i + 1;
                const pct = currentCategoryTotalVotes > 0 ? Math.round((n.votes / currentCategoryTotalVotes) * 100) : 0;

                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-black/5 shadow-card bg-white overflow-hidden hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-28 bg-gray-100 overflow-hidden">
                      <img src={n.img || '/cat_rider_awards.jpg'} alt={n.name} className="w-full h-full object-cover" />
                      <span
                        className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white"
                        style={{ background: RANK_COLORS[rank] ?? '#64748B' }}
                      >
                        #{rank}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-brand-green uppercase tracking-wide truncate">
                          {n.categoryName}
                        </p>
                        <h4 className="font-display font-extrabold text-sm text-brand-ink truncate">{n.name}</h4>
                        <p className="text-[11px] text-brand-ink/50 truncate mt-0.5">{n.county || 'Kenya'}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-black/5">
                        <div className="flex items-center justify-between text-xs font-bold text-brand-ink mb-1">
                          <span>{n.votes.toLocaleString()} votes</span>
                          <span className="text-brand-green text-[11px]">{pct}%</span>
                        </div>

                        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>

                        <button
                          onClick={() => castVote(n.id, n.name, n.categoryName)}
                          className="w-full py-1.5 rounded-lg bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-1"
                        >
                          <VoteIcon size={12} /> Vote (KES 1)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-brand-ink/[0.01] px-4 py-3">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="font-display font-extrabold text-base text-brand-ink leading-none">{value}</p>
        <p className="text-xs text-brand-ink/50 mt-1">{label}</p>
      </div>
    </div>
  );
}
