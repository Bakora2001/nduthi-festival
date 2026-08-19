import { useState } from 'react';
import { ArrowRight, Clock, ShieldCheck, Lock, TrendingUp, Info } from 'lucide-react';
import { useVote } from '../context/VoteContext';
import SEO from '../components/SEO';
import PodiumLeaderboard from '../components/PodiumLeaderboard';

export default function Categories() {
  const { categories, nominees, totalVotes, castVote, isVotingEnabled } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <SEO
        title="Award Categories & Nominees | Nduthi Festival Kenya"
        description="Browse all award categories at the Nduthi Festival Kenya. Vote for your favourite riders, motorcycle clubs, and industry personalities. Kenya's premier motorcycle awards."
        url="https://nduthifestival.co.ke/categories"
        keywords="Nduthi Festival categories, nduthi nominees, nduthi vote, motorcycle awards categories Kenya, best rider Kenya, nduthi fest nominees 2025"
      />

      {/* ── Page Hero Banner ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 200 }}>
        <img
          src="/hero_flag_bg.jpg"
          alt="Nduthi Festival Kenya"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-40 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 55%, rgba(255,255,255,0) 80%)' }}
        />

        <div className="container-nd relative grid lg:grid-cols-[1fr_auto] gap-6 items-center py-8 z-10">
          <div>
            <p className="text-xs text-brand-ink/45 mb-2">
              <a href="/" className="hover:text-brand-green">Home</a>
              <span className="mx-1.5 text-brand-ink/30">/</span>
              <span className="text-brand-ink/70">Categories & Nominees</span>
            </p>
            <h1 className="font-display font-black leading-[1.05] text-[2.2rem] sm:text-[2.7rem]">
              <span className="text-brand-green">OFFICIAL</span>{' '}
              <span className="text-brand-ink">AWARD</span>
              <br />
              <span className="text-brand-ink">CATEGORIES & NOMINEES</span>
            </h1>
            <p className="text-sm text-brand-ink/60 mt-3 max-w-md leading-relaxed">
              Explore the 10 official award categories, view registered participants across Eldoret & Kenya, or click any photo to zoom in.
            </p>
          </div>

          <div className="hidden lg:flex items-end gap-0 relative" style={{ height: 180 }}>
            <img
              src="/hero_motorcycle.jpg"
              alt="Motorcycle"
              className="object-contain h-full"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.12))', maxWidth: 240, mixBlendMode: 'multiply' }}
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="container-nd relative pb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm z-10">
          {[
            { label: 'Award Categories', value: String(categories.length), icon: '🏆' },
            { label: 'Registered Nominees', value: String(nominees.length), icon: '🏍️' },
            { label: 'Total Votes Cast', value: totalVotes.toLocaleString(), icon: '📊' },
            { label: 'Status', value: isVotingEnabled ? 'Voting Live' : 'Registration Phase', icon: '📲' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-xl px-4 py-3 border border-black/5 shadow-card">
              <span className="text-xl shrink-0">{s.icon}</span>
              <div>
                <p className="font-display text-base font-extrabold text-brand-ink leading-none">{s.value}</p>
                <p className="text-[10px] text-brand-ink/50 mt-1 leading-none">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Section with Horizontal Categories & Podium ── */}
      <section className="py-10">
        <div className="container-nd space-y-6">
          {/* Registration Notice Banner */}
          {!isVotingEnabled && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl shrink-0">⏳</span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-800" /> Participant Registration Open
                  </h4>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                    Public voting is currently paused to allow riders, motorcycle clubs, dealers and mechanics across Kenya to register. Register now to receive your official nominee ballot number!
                  </p>
                </div>
              </div>
              <a
                href="/login"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-sm transition-all hover:scale-105"
              >
                <span>Register as Participant</span> <ArrowRight size={14} />
              </a>
            </div>
          )}

          {/* Full-width Podium Leaderboard with Horizontal Category Bar */}
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
