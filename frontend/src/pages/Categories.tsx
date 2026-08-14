import { useState } from 'react';
import { Bike, Trophy, Users, Cog, Camera, Star, ShieldCheck, Lock, TrendingUp, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const ICONS: Record<string, typeof Bike> = {
  rider: Bike,
  trophy: Trophy,
  club: Users,
  industry: Cog,
  camera: Camera,
  star: Star,
};

const ACCENT_BG = ['bg-[#0B8E36]', 'bg-[#D61F26]', 'bg-[#F5C542] text-brand-ink', 'bg-blue-600', 'bg-purple-600', 'bg-orange-500'];
const ACCENT_BTN = ['bg-[#0B8E36] hover:bg-[#076B29]', 'bg-[#D61F26] hover:bg-[#A8181D]', 'bg-[#F5C542] hover:bg-[#D9A82B] text-brand-ink', 'bg-blue-600 hover:bg-blue-700', 'bg-purple-600 hover:bg-purple-700', 'bg-orange-500 hover:bg-orange-600'];

export default function Categories() {
  const { categories, nominees, totalVotes, castVote, userVotedIds } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const filteredNominees = selectedCatId
    ? nominees.filter((n) => n.categoryId === selectedCatId)
    : nominees;

  return (
    <div>
      {/* ── Page hero banner ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 200 }}>
        <img
          src="/hero_flag_bg.jpg"
          alt=""
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
              <span className="text-brand-ink/70">Categories & Voting</span>
            </p>
            <h1 className="font-display font-extrabold leading-[1.05] text-[2.2rem] sm:text-[2.7rem]">
              <span className="text-brand-green">OFFICIAL</span>{' '}
              <span className="text-brand-ink">AWARD</span>
              <br />
              <span className="text-brand-ink">CATEGORIES & NOMINEES</span>
            </h1>
            <p className="text-sm text-brand-ink/60 mt-3 max-w-md leading-relaxed">
              Explore categories, view registered participants, and vote for your favorite riders for KES 1 via M-Pesa.
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
            { label: 'Categories', value: String(categories.length), icon: '🏆' },
            { label: 'Registered Nominees', value: String(nominees.length), icon: '🏍️' },
            { label: 'Total Votes Cast', value: totalVotes.toLocaleString(), icon: '📊' },
            { label: 'Fee per Vote', value: 'KES 1', icon: '📲' },
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

      <section className="py-8 bg-brand-green-light/20 min-h-[500px]">
        <div className="container-nd grid lg:grid-cols-[240px_1fr_280px] gap-6">
          {/* Filter sidebar */}
          <aside className="bg-white rounded-2xl border border-black/5 shadow-card p-5 h-fit hidden lg:block">
            <h3 className="text-xs font-bold text-brand-ink tracking-wider uppercase mb-3">Filter Category</h3>
            <ul className="space-y-1 text-sm font-semibold">
              <li
                onClick={() => setSelectedCatId(null)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedCatId === null ? 'bg-brand-green text-white' : 'text-brand-ink/70 hover:bg-black/[0.03]'
                }`}
              >
                All Categories ({nominees.length})
              </li>
              {categories.map((c) => {
                const count = nominees.filter((n) => n.categoryId === c.id).length;
                return (
                  <li
                    key={c.id}
                    onClick={() => setSelectedCatId(c.id)}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedCatId === c.id ? 'bg-brand-green text-white' : 'text-brand-ink/70 hover:bg-black/[0.03]'
                    }`}
                  >
                    {c.name}
                    <span className="text-xs ml-1 font-normal opacity-70">({count})</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-4 border-t border-black/5">
              <a
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-green/10 text-brand-green text-xs font-bold py-2.5 rounded-xl hover:bg-brand-green hover:text-white transition-all"
              >
                <span>➕ Register as Participant</span>
              </a>
            </div>
          </aside>

          {/* Nominees Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-xl text-brand-ink">
                {selectedCatId
                  ? categories.find((c) => c.id === selectedCatId)?.name || 'Category Nominees'
                  : 'All Registered Participants'}
              </h2>
              <span className="text-xs font-semibold text-brand-ink/50">
                {filteredNominees.length} Participant{filteredNominees.length === 1 ? '' : 's'}
              </span>
            </div>

            {filteredNominees.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-black/5 shadow-card">
                <p className="text-2xl mb-2">🏍️</p>
                <h3 className="font-bold text-base text-brand-ink">No participants in this category yet</h3>
                <p className="text-xs text-brand-ink/50 mt-1 max-w-sm mx-auto">
                  Be the first to register as a participant in this category!
                </p>
                <a
                  href="/register"
                  className="mt-4 inline-flex items-center gap-2 bg-brand-green text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-brand-green-dark"
                >
                  Register as Participant <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredNominees.map((nom, idx) => {
                  const hasVoted = userVotedIds.includes(nom.id);
                  const btnColor = ACCENT_BTN[idx % ACCENT_BTN.length];

                  return (
                    <div
                      key={nom.id}
                      className="bg-white rounded-2xl border border-black/5 shadow-card p-5 flex flex-col justify-between hover:shadow-card-lg transition-all duration-300 relative overflow-hidden"
                    >
                      {nom.rank && nom.rank <= 3 && (
                        <div className="absolute top-3 right-3 bg-brand-gold text-brand-ink font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                          Rank #{nom.rank}
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <img
                          src={nom.img || '/cat_rider_awards.jpg'}
                          alt={nom.name}
                          className="w-16 h-16 rounded-xl object-cover border border-black/5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">
                            {nom.categoryName}
                          </span>
                          <h3 className="font-display font-extrabold text-base text-brand-ink truncate leading-snug">
                            {nom.name}
                          </h3>
                          <p className="text-xs text-brand-ink/60 truncate mt-0.5">
                            📍 {nom.county || 'Nairobi'} {nom.make ? `• ${nom.make} ${nom.model || ''}` : ''}
                          </p>
                          {nom.registrationPlate && nom.registrationPlate !== 'N/A' && (
                            <p className="text-[10px] font-mono font-bold bg-brand-ink/5 px-2 py-0.5 rounded inline-block mt-1 text-brand-ink/70">
                              {nom.registrationPlate}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between">
                        <div>
                          <p className="font-display font-extrabold text-base text-brand-ink leading-none">
                            {nom.votes.toLocaleString()} <span className="text-xs font-normal text-brand-ink/50">votes</span>
                          </p>
                        </div>

                        <button
                          onClick={() => castVote(nom.id, nom.name, nom.categoryName)}
                          disabled={hasVoted}
                          className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                            hasVoted ? 'bg-gray-400 cursor-not-allowed' : btnColor
                          }`}
                        >
                          {hasVoted ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Voted</span>
                            </>
                          ) : (
                            <>
                              <span>Vote (KES 1)</span>
                              <ArrowRight size={13} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-5 hidden lg:block">
            <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-brand-green" />
                <h3 className="text-xs font-bold text-brand-ink tracking-wider uppercase">How Voting Works</h3>
              </div>
              <p className="text-xs text-brand-ink/55 leading-relaxed mb-4">
                Voting costs <strong>KES 1 per vote</strong> via M-Pesa STK Push. Every vote updates the live leaderboard in real-time.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-brand-ink/70 border-t border-black/5 pt-3">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-brand-green" /> Instant M-Pesa Prompt</li>
                <li className="flex items-center gap-2"><Lock size={14} className="text-brand-green" /> Email Payment Receipt</li>
                <li className="flex items-center gap-2"><TrendingUp size={14} className="text-brand-green" /> Real-time Live Tally</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
