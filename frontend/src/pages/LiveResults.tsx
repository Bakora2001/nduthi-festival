import { motion } from 'framer-motion';
import { useState } from 'react';
import { Vote as VoteIcon, ArrowRight, Radio, Trophy, Award, Sparkles, Clock, ZoomIn } from 'lucide-react';
import { useVote } from '../context/VoteContext';
import ImageModal, { ImageModalData } from '../components/ImageModal';
import SEO from '../components/SEO';

const RANK_COLORS: Record<number, string> = {
  1: '#F5C542',
  2: '#94A3B8',
  3: '#B45309',
};

export default function LiveResults() {
  const { nominees, categories, totalVotes, castVote, isVotingEnabled } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedImageNominee, setSelectedImageNominee] = useState<ImageModalData | null>(null);

  const filteredNominees = selectedCatId
    ? nominees.filter((n) => n.categoryId === selectedCatId)
    : nominees;

  const currentCategoryTotalVotes = filteredNominees.reduce((sum, n) => sum + n.votes, 0);

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Live Voting Results | Nduthi Festival & Awards Kenya"
        description="See live voting results for the Nduthi Festival & Awards Kenya. Track who's winning in each category — riders, clubs, motorcycles and more. Vote now and make your voice count!"
        url="https://nduthifestival.co.ke/live-results"
        keywords="nduthi festival results, nduthi live voting, nduthi fest leaderboard, motorcycle awards results Kenya, nduthi vote results"
      />
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
            <span className="inline-flex items-center gap-1.5 ml-3 text-xs font-bold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full align-middle">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" /> WEBSOCKET LIVE
            </span>
          </h1>
          <p className="mt-2 text-sm text-brand-ink/60 max-w-md leading-relaxed">
            Real-time voting statistics across Eldoret, Kenya. Click any participant's image to view full-size photos.
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
            <div className="flex items-center gap-1.5 mb-0.5">
              <Radio size={14} className="text-brand-green animate-pulse" />
              <span className="text-xs font-extrabold text-brand-green">INSTANT SYNC</span>
            </div>
            <p className="text-[11px] text-brand-ink/60 font-semibold">WebSockets Connected</p>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="container-nd py-8 grid lg:grid-cols-[260px_1fr] gap-6">

        {/* LEFT SIDEBAR CATEGORIES */}
        <aside className="hidden lg:flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-[10px] font-extrabold text-brand-ink/50 tracking-widest uppercase mb-3">Award Categories</h3>
            <ul className="space-y-1">
              <li
                onClick={() => setSelectedCatId(null)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  selectedCatId === null ? 'bg-brand-green text-white shadow-sm' : 'text-brand-ink/70 hover:bg-black/[0.03]'
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                      isSelected ? 'bg-brand-green text-white shadow-sm' : 'text-brand-ink/70 hover:bg-black/[0.03]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="opacity-75 text-[10px] shrink-0 ml-1">({count})</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <div className="space-y-6 min-w-0">
          {/* Registration Notice */}
          {!isVotingEnabled && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">⏳</span>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-800" /> Participant Registration Open
                  </h4>
                  <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                    Voting will officially open once participant registration closes. Register your bike now!
                  </p>
                </div>
              </div>
              <a
                href="/login"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-sm transition-all"
              >
                Register as Participant <ArrowRight size={13} />
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-extrabold text-brand-ink tracking-tight uppercase">
                {selectedCatId
                  ? categories.find((c) => c.id === selectedCatId)?.name || 'Category Leaderboard'
                  : 'Overall Leaderboard'}
              </h2>
              <span className="text-xs text-brand-ink/50 font-semibold">
                {currentCategoryTotalVotes.toLocaleString()} votes total
              </span>
            </div>
          </div>

          {/* NOMINEES LEADERBOARD GRID */}
          {filteredNominees.length === 0 ? (
            <div className="text-center py-16 bg-brand-ink/[0.02] border border-black/5 rounded-3xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto text-brand-green text-xl">
                🏍️
              </div>
              <h3 className="font-display font-bold text-base text-brand-ink">No Participants Yet</h3>
              <p className="text-xs text-brand-ink/60 max-w-sm mx-auto">
                Be the first to register in this category and get votes!
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark transition-all mt-2"
              >
                Register as Participant <ArrowRight size={13} />
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNominees.map((n, idx) => {
                const rankColor = RANK_COLORS[n.rank] || '#475569';
                const totalForCat = currentCategoryTotalVotes || 1;
                const pct = Math.round((n.votes / totalForCat) * 100);

                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-black/5 shadow-card p-4 flex flex-col justify-between hover:shadow-card-lg transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: rankColor }}
                          >
                            {n.rank || idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide truncate max-w-[140px]">
                            {n.categoryName}
                          </span>
                        </div>
                        <span className="font-display text-sm font-extrabold text-brand-ink">
                          {n.votes.toLocaleString()} <span className="text-[10px] text-brand-ink/50 font-normal">votes</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        {/* Clickable Image Thumbnail */}
                        <div
                          onClick={() => setSelectedImageNominee({
                            imageUrl: n.img || '/cat_motorcycle.jpg',
                            name: n.name,
                            categoryName: n.categoryName,
                            county: n.county,
                            make: n.make,
                            model: n.model,
                            registrationPlate: n.registrationPlate,
                          })}
                          className="relative cursor-pointer group shrink-0"
                          title="Click to view full photo"
                        >
                          <img
                            src={n.img || '/cat_motorcycle.jpg'}
                            alt={n.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-black/10 group-hover:scale-105 group-hover:shadow-md transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-[1px]">
                            <ZoomIn size={16} />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4
                            onClick={() => setSelectedImageNominee({
                              imageUrl: n.img || '/cat_motorcycle.jpg',
                              name: n.name,
                              categoryName: n.categoryName,
                              county: n.county,
                              make: n.make,
                              model: n.model,
                              registrationPlate: n.registrationPlate,
                            })}
                            className="font-display font-bold text-sm text-brand-ink truncate cursor-pointer hover:text-brand-green transition-colors"
                          >
                            {n.name}
                          </h4>
                          <p className="text-[11px] text-brand-ink/50 truncate mt-0.5">{n.county || 'Eldoret, Kenya'}</p>
                          {n.make && (
                            <p className="text-[10px] font-semibold text-brand-ink/40 truncate">
                              {n.make} {n.model || ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Vote bar */}
                      <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-brand-green rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>

                      {!isVotingEnabled ? (
                        <button
                          onClick={() => castVote(n.id, n.name, n.categoryName)}
                          className="w-full py-2 rounded-xl bg-black/5 text-brand-ink/60 text-xs font-bold border border-black/5 hover:bg-black/10 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>⏳ Voting Opens Soon</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => castVote(n.id, n.name, n.categoryName)}
                          className="w-full py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <VoteIcon size={12} /> Vote
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Resolution Photo Lightbox Modal */}
      <ImageModal
        isOpen={!!selectedImageNominee}
        data={selectedImageNominee}
        onClose={() => setSelectedImageNominee(null)}
      />
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-black/5 shadow-card">
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="font-display text-base font-extrabold text-brand-ink leading-none">{value}</p>
        <p className="text-[10px] text-brand-ink/50 mt-1 leading-none">{label}</p>
      </div>
    </div>
  );
}
