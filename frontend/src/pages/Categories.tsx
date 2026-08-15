import { useState } from 'react';
import { Bike, Trophy, Users, Cog, Camera, Star, ShieldCheck, Lock, TrendingUp, Info, ArrowRight, CheckCircle2, Clock, ZoomIn } from 'lucide-react';
import { useVote } from '../context/VoteContext';
import ImageModal, { ImageModalData } from '../components/ImageModal';

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
  const { categories, nominees, totalVotes, castVote, isVotingEnabled } = useVote();
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [selectedImageNominee, setSelectedImageNominee] = useState<ImageModalData | null>(null);

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
              <span className="text-brand-ink/70">Categories & Nominees</span>
            </p>
            <h1 className="font-display font-extrabold leading-[1.05] text-[2.2rem] sm:text-[2.7rem]">
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
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-green text-white text-xs font-bold py-2.5 rounded-xl hover:bg-brand-green-dark transition-all shadow-sm"
              >
                <span>➕ Register as Participant</span>
              </a>
            </div>
          </aside>

          {/* Nominees Grid */}
          <div className="space-y-6">
            {/* Registration Banner */}
            {!isVotingEnabled && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">⏳</span>
                  <div>
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-800" /> Participant Registration Open
                    </h4>
                    <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                      Public voting is temporarily paused to allow riders and motorcycle owners across Kenya to register. Register now to be on the ballot!
                    </p>
                  </div>
                </div>
                <a
                  href="/login"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-brand-green-dark shadow-sm transition-all"
                >
                  Register Now <ArrowRight size={13} />
                </a>
              </div>
            )}

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
                  href="/login"
                  className="mt-4 inline-flex items-center gap-2 bg-brand-green text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow hover:bg-brand-green-dark"
                >
                  Register as Participant <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredNominees.map((nom, idx) => {
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
                        {/* Clickable Image with Zoom Popup */}
                        <div
                          onClick={() => setSelectedImageNominee({
                            imageUrl: nom.img || '/cat_rider_awards.jpg',
                            name: nom.name,
                            categoryName: nom.categoryName,
                            county: nom.county,
                            make: nom.make,
                            model: nom.model,
                            registrationPlate: nom.registrationPlate,
                          })}
                          className="relative cursor-pointer group shrink-0"
                          title="Click to view full photo"
                        >
                          <img
                            src={nom.img || '/cat_rider_awards.jpg'}
                            alt={nom.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-black/10 group-hover:scale-105 group-hover:shadow-md transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-black/35 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-[1px]">
                            <ZoomIn size={18} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">
                            {nom.categoryName}
                          </span>
                          <h3
                            onClick={() => setSelectedImageNominee({
                              imageUrl: nom.img || '/cat_rider_awards.jpg',
                              name: nom.name,
                              categoryName: nom.categoryName,
                              county: nom.county,
                              make: nom.make,
                              model: nom.model,
                              registrationPlate: nom.registrationPlate,
                            })}
                            className="font-display font-extrabold text-base text-brand-ink truncate leading-snug cursor-pointer hover:text-brand-green transition-colors"
                          >
                            {nom.name}
                          </h3>
                          <p className="text-xs text-brand-ink/60 truncate mt-0.5">
                            📍 {nom.county || 'Eldoret, Kenya'} {nom.make ? `• ${nom.make} ${nom.model || ''}` : ''}
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

                        {!isVotingEnabled ? (
                          <button
                            onClick={() => castVote(nom.id, nom.name, nom.categoryName)}
                            className="inline-flex items-center gap-1.5 text-brand-ink/60 bg-black/5 hover:bg-black/10 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-black/5"
                          >
                            <span>⏳ Voting Opens Soon</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => castVote(nom.id, nom.name, nom.categoryName)}
                            className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-95 ${btnColor}`}
                          >
                            <span>Vote</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
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
                Voting rate is <strong>KES 10 per vote</strong> via M-Pesa STK Push. Voters can choose any custom amount to vote with. Every vote updates the leaderboard in real-time.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-brand-ink/70 border-t border-black/5 pt-3">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-brand-green" /> Instant M-Pesa Prompt</li>
                <li className="flex items-center gap-2"><Lock size={14} className="text-brand-green" /> Flexible Vote Amount</li>
                <li className="flex items-center gap-2"><TrendingUp size={14} className="text-brand-green" /> Real-time Live Tally</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Full Resolution Photo Lightbox Modal */}
      <ImageModal
        isOpen={!!selectedImageNominee}
        data={selectedImageNominee}
        onClose={() => setSelectedImageNominee(null)}
      />
    </div>
  );
}
