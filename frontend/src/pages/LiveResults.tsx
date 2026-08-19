import { useState } from 'react';
import { Radio } from 'lucide-react';
import { useVote } from '../context/VoteContext';
import SEO from '../components/SEO';
import PodiumLeaderboard from '../components/PodiumLeaderboard';

export default function LiveResults() {
  const { nominees, categories, totalVotes, castVote, isVotingEnabled } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <SEO
        title="Live Voting Results & Leaderboard | Nduthi Festival Kenya"
        description="See live voting results and leaderboard for the Nduthi Festival & Awards Kenya. Track top leading riders, clubs, and motorcycles in real-time."
        url="https://nduthifestival.co.ke/live-results"
        keywords="nduthi festival results, nduthi live voting, nduthi fest leaderboard, motorcycle awards results Kenya, nduthi vote results"
      />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 180 }}>
        <img
          src="/hero_flag_bg.jpg"
          alt="Nduthi Festival Kenya"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-35 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 52%, rgba(255,255,255,0) 78%)' }}
        />

        <div className="container-nd relative py-6 z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display font-black leading-[1.05] text-[2.2rem] sm:text-[2.6rem]">
              <span className="text-brand-ink">LIVE </span>
              <span className="text-brand-red">RESULTS & LEADERBOARD</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" /> LIVE TALLY
            </span>
          </div>
          <p className="mt-2 text-sm text-brand-ink/60 max-w-md leading-relaxed">
            Real-time voting tally and standings across Eldoret, Kenya. Click any category tab below to view podium standings and participants.
          </p>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <div className="border-b border-black/5 bg-white">
        <div className="container-nd py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon="📊" label="Total Votes Cast" value={totalVotes.toLocaleString()} />
          <StatBox icon="🏍️" label="Registered Participants" value={String(nominees.length)} />
          <StatBox icon="🏆" label="Award Categories" value={String(categories.length)} />
          <StatBox icon="⚡" label="Leaderboard Status" value={isVotingEnabled ? 'Voting Active' : 'Live Standings'} />
        </div>
      </div>

      {/* ── MAIN CONTENT WITH PODIUM LEADERBOARD ── */}
      <section className="py-10">
        <div className="container-nd">
          <PodiumLeaderboard
            categories={categories}
            nominees={nominees}
            selectedCategoryId={selectedCatId}
            onSelectCategory={setSelectedCatId}
            isVotingEnabled={isVotingEnabled}
            onCastVote={castVote}
          />
        </div>
      </section>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#FAFAF8] rounded-xl px-4 py-3 border border-black/5">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="font-display text-base font-extrabold text-brand-ink leading-none">{value}</p>
        <p className="text-[10px] text-brand-ink/50 mt-1 uppercase font-semibold tracking-wider leading-none">
          {label}
        </p>
      </div>
    </div>
  );
}
