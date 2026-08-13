import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bike, Trophy, Users, Cog, Camera, Star, Share2, RefreshCw, Vote as VoteIcon } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const CATEGORIES = [
  { name: 'Rider Awards', icon: Bike, votes: 8855, color: '#0B8E36' },
  { name: 'Motorcycle Excellence', icon: Trophy, votes: 7860, color: '#D61F26' },
  { name: 'Riders Clubs', icon: Users, votes: 5320, color: '#F5C542' },
  { name: 'Industry Awards', icon: Cog, votes: 2980, color: '#2563EB' },
  { name: 'Media Awards', icon: Camera, votes: 1780, color: '#7C3AED' },
  { name: 'Special Honours', icon: Star, votes: 170, color: '#F59E0B' },
];

const RANK_COLORS: Record<number, string> = {
  1: '#F5C542',
  2: '#94A3B8',
  3: '#B45309',
};

export default function LiveResults() {
  const { nominees, totalVotes, castVote } = useVote();
  const [countdown, setCountdown] = useState(5);
  const [activeLeaderTab, setActiveLeaderTab] = useState<'today' | 'week' | 'all'>('today');

  // 5-second auto-refresh countdown
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 5 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const categoryTotalVotes = nominees.reduce((s, n) => s + n.votes, 0);

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 210 }}>
        <img src="/hero_flag_bg.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right"
          style={{ zIndex: 1, opacity: 0.38 }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 52%, rgba(255,255,255,0) 78%)', zIndex: 2 }} />

        {/* Motorcycle */}
        <img src="/hero_motorcycle.jpg" alt="Motorcycle" className="absolute pointer-events-none select-none"
          style={{ zIndex: 4, right: '18%', top: '2%', bottom: 0, height: '100%', width: 'auto', maxWidth: '40%',
            objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1) saturate(1.1)' }} />
        {/* Trophy */}
        <img src="/hero_trophy.jpg" alt="Trophy" className="absolute pointer-events-none select-none"
          style={{ zIndex: 5, right: '3%', top: '5%', height: '80%', width: 'auto', maxWidth: '12%',
            objectFit: 'contain', mixBlendMode: 'multiply' }} />
        {/* Trophy label */}
        <div className="absolute rounded-lg px-2 py-1 shadow-lg" style={{ zIndex: 6, right: '3%', bottom: '6%', background: 'rgba(20,35,26,0.82)' }}>
          <p className="text-[8px] font-black text-[#F5C542] tracking-widest uppercase">NDUTHI FESTIVAL</p>
          <p className="text-[7px] font-semibold text-white/70 tracking-widest uppercase">& AWARDS KENYA</p>
        </div>

        <div className="container-nd relative" style={{ zIndex: 7 }}>
          <div className="pt-8 pb-6 max-w-[48%]">
            <h1 className="font-display font-extrabold leading-[1.05] text-[2.5rem]">
              <span className="text-brand-ink">LIVE </span>
              <span className="text-brand-red">RESULTS</span>
              <span className="inline-flex items-center gap-1.5 ml-3 text-sm font-bold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full align-middle">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" /> LIVE
              </span>
            </h1>
            <p className="mt-2 text-sm text-brand-ink/60 max-w-sm leading-relaxed">
              Real-time voting results from across all award categories.<br />
              Results update automatically as votes are cast.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div className="border-b border-black/5 bg-white">
        <div className="container-nd py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatBox icon="📊" label="Total Votes Cast" value={totalVotes.toLocaleString()} trend="↑ 18.6% from yesterday" trendColor="text-brand-green" />
          <StatBox icon="👤" label="Registered Voters" value="5,432" trend="↑ 9.7% from yesterday" trendColor="text-brand-green" />
          <StatBox icon="🏆" label="Categories" value="12" trend="All award categories" trendColor="text-brand-ink/50" />
          <StatBox icon="🕐" label="Last Updated" value={timeStr} trend="May 18, 2025" trendColor="text-brand-ink/50" />
          <div className="flex flex-col justify-center items-center rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3 text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-sm font-extrabold text-brand-green">LIVE</span>
            </div>
            <p className="text-xs text-brand-ink/60 font-semibold">Results updating</p>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="container-nd py-8 grid lg:grid-cols-[220px_1fr_260px] gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-[10px] font-extrabold text-brand-ink/50 tracking-widest uppercase mb-3">Award Categories</h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <li key={i} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200 ${i === 0 ? 'bg-brand-green text-white' : 'text-brand-ink/70 hover:bg-black/[0.03]'}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-white/20' : 'bg-black/[0.04]'}`}>
                      <Icon size={13} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${i === 0 ? 'text-white' : ''}`}>{cat.name}</p>
                      <p className={`text-[10px] ${i === 0 ? 'text-white/70' : 'text-brand-ink/40'}`}>{cat.votes.toLocaleString()} Votes</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Trust badge */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center mb-2">
              <span className="text-brand-green text-sm">🛡️</span>
            </div>
            <h4 className="text-sm font-extrabold text-brand-ink">Transparent &amp; Fair</h4>
            <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed">Our voting system is 100% transparent and secure.</p>
            <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-green hover:underline">
              Learn More →
            </a>
          </div>

          {/* Rider image */}
          <div className="rounded-2xl overflow-hidden shadow-card border border-black/5" style={{ height: 140 }}>
            <img src="/nominee_rider_1.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <div className="space-y-6 min-w-0">
          {/* Category header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-extrabold text-brand-ink tracking-tight">RIDER OF THE YEAR</h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" /> LIVE
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-ink/55">
              <span className="flex items-center gap-1"><RefreshCw size={11} /> Auto refresh in: <strong className="text-brand-green">{countdown}s</strong></span>
              <button className="flex items-center gap-1 hover:text-brand-green transition-colors"><Share2 size={11} /> Share Results</button>
            </div>
          </div>

          {/* Live Nominee cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {nominees.map((n, i) => {
              const pct = categoryTotalVotes > 0 ? Math.round((n.votes / categoryTotalVotes) * 100) : 0;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl border border-black/5 shadow-card bg-white overflow-hidden hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Rank badge + Photo */}
                  <div className="relative h-28 bg-gray-100 overflow-hidden">
                    <img src={n.img} alt={n.name} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-white"
                      style={{ background: RANK_COLORS[n.rank] ?? '#64748B' }}
                    >
                      {n.rank}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-display text-sm font-extrabold text-brand-ink leading-snug">{n.name}</p>
                      <p className="text-base font-black text-brand-green mt-1">
                        {n.votes.toLocaleString()} <span className="text-[10px] font-semibold text-brand-ink/50">Votes</span>
                      </p>
                      <p className="text-[10px] text-brand-ink/45 mt-0.5">{pct}% of total votes</p>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 rounded-full bg-black/5 overflow-hidden">
                        <div className="h-full rounded-full bg-brand-green transition-all duration-500" style={{ width: `${Math.min(pct * 2, 100)}%` }} />
                      </div>
                    </div>

                    {/* VOTE NOW CTA BUTTON */}
                    <button
                      onClick={() => castVote(n.id, n.name, 'Rider of the Year')}
                      className="mt-3 w-full py-2 px-3 rounded-xl bg-brand-green text-white text-xs font-bold shadow-card flex items-center justify-center gap-1.5 hover:bg-brand-green-dark transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                      <VoteIcon size={13} /> Vote Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Real-time notice */}
          <div className="flex items-center justify-between rounded-xl border border-brand-green/15 bg-brand-green/5 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
              <div>
                <p className="text-sm font-bold text-brand-green">Results update in real-time</p>
                <p className="text-xs text-brand-ink/55">Clicking "Vote Now" instantly updates vote counts across all clients.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-brand-ink/50">Total votes in this category:</p>
              <p className="font-display text-lg font-black text-brand-ink">{categoryTotalVotes.toLocaleString()}</p>
            </div>
          </div>

          {/* All Categories Live Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-extrabold text-sm text-brand-ink tracking-tight uppercase">All Categories Live Overview</h3>
              <a href="/categories" className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1">
                View All Categories →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                const maxV = CATEGORIES[0].votes;
                const pct = Math.round((cat.votes / maxV) * 100);
                return (
                  <div key={i} className="text-center">
                    <div className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center" style={{ background: cat.color + '20' }}>
                      <Icon size={14} style={{ color: cat.color }} />
                    </div>
                    <p className="text-[10px] font-bold text-brand-ink leading-tight truncate px-1">{cat.name}</p>
                    <p className="text-xs font-extrabold text-brand-ink mt-0.5">{cat.votes.toLocaleString()}</p>
                    <p className="text-[9px] text-brand-ink/40">Votes</p>
                    <div className="mt-1.5 h-1 rounded-full bg-black/5 mx-2">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-4">
          {/* Overall Leaderboard */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🏆</span>
                <h3 className="text-xs font-extrabold text-brand-ink tracking-wider uppercase">Overall Leaderboard</h3>
              </div>
              <a href="#" className="text-[10px] font-bold text-brand-green hover:underline">View Full</a>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 mb-3 bg-brand-ink/[0.04] rounded-lg p-1">
              {(['today', 'week', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveLeaderTab(t)}
                  className={`flex-1 text-[10px] font-bold py-1 rounded-md transition-all capitalize ${activeLeaderTab === t ? 'bg-brand-green text-white' : 'text-brand-ink/60 hover:text-brand-ink'}`}
                >
                  {t === 'week' ? 'This Week' : t === 'all' ? 'All Time' : 'Today'}
                </button>
              ))}
            </div>
            <ul className="space-y-2.5">
              {nominees.map((e) => (
                <li key={e.id} className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ background: RANK_COLORS[e.rank] ?? '#64748B' }}
                  >
                    {e.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-ink truncate">{e.name}</p>
                    <p className="text-[10px] text-brand-ink/45 truncate">{e.categoryName}</p>
                  </div>
                  <span className="text-xs font-extrabold text-brand-green shrink-0">{e.votes.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Festival Stats */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-[10px] font-extrabold text-brand-ink/50 tracking-widest uppercase mb-3">Festival Stats</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Total Votes Today', value: '4,560', trend: '↑ 12.4%', icon: '📊', color: 'text-brand-green' },
                { label: 'Total Votes This Week', value: '18,760', trend: '↑ 15.8%', icon: '📅', color: 'text-brand-green' },
                { label: 'Unique Voters', value: '3,890', trend: '↑ 10.2%', icon: '👤', color: 'text-brand-green' },
                { label: 'Votes Per Minute', value: '32', trend: '🔴 LIVE', icon: '⚡', color: 'text-brand-red' },
              ].map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.icon}</span>
                    <span className="text-xs text-brand-ink/65">{s.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-brand-ink">{s.value}</span>
                    <span className={`ml-1.5 text-[10px] font-bold ${s.color}`}>{s.trend}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, trend, trendColor }: { icon: string; label: string; value: string; trend: string; trendColor: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white shadow-card px-4 py-3.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">{icon}</span>
        <p className="text-[10px] font-bold text-brand-ink/50 tracking-wider uppercase leading-snug">{label}</p>
      </div>
      <p className="font-display text-xl font-extrabold text-brand-ink leading-none">{value}</p>
      <p className={`text-[10px] font-semibold mt-1 ${trendColor}`}>{trend}</p>
    </div>
  );
}
