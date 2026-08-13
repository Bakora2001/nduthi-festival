import { Bike, Trophy, Users, Cog, Camera, Star, ShieldCheck, Lock, TrendingUp, Info, ArrowRight } from 'lucide-react';
import { categories, stats } from '../data/mockData';
import { CategoryIcon } from '../types';
import { useVote } from '../context/VoteContext';

const ICONS: Record<CategoryIcon, typeof Bike> = {
  rider: Bike,
  trophy: Trophy,
  club: Users,
  industry: Cog,
  camera: Camera,
  star: Star,
};

const ACCENT_BG: Record<string, string> = {
  green: 'bg-[#0B8E36]',
  red: 'bg-[#D61F26]',
  gold: 'bg-[#F5C542] text-brand-ink',
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-500',
};

const ACCENT_BTN: Record<string, string> = {
  green: 'bg-[#0B8E36] hover:bg-[#076B29]',
  red: 'bg-[#D61F26] hover:bg-[#A8181D]',
  gold: 'bg-[#F5C542] hover:bg-[#D9A82B] text-brand-ink',
  blue: 'bg-blue-600 hover:bg-blue-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  orange: 'bg-orange-500 hover:bg-orange-600',
};

const CAT_IMAGES: Record<string, string> = {
  '1': '/cat_rider_awards.jpg',
  '2': '/cat_excellence.jpg',
  '3': '/nominee_riders_club.jpg',
  '4': '/cat_industry.jpg',
  '5': '/cat_media.jpg',
  '6': '/cat_special.jpg',
};

export default function Categories() {
  const { castVote } = useVote();
  return (
    <div>
      {/* ── Page hero banner ── */}
      <section className="relative overflow-hidden bg-white border-b border-black/5" style={{ minHeight: 220 }}>
        {/* Flag background */}
        <img
          src="/hero_flag_bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right"
          style={{ zIndex: 1, opacity: 0.4 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, #fff 55%, rgba(255,255,255,0) 80%)', zIndex: 2 }}
        />

        <div className="container-nd relative grid lg:grid-cols-[1fr_auto] gap-6 items-center py-8" style={{ zIndex: 3 }}>
          <div>
            <p className="text-xs text-brand-ink/45 mb-2">
              <a href="/" className="hover:text-brand-green">Home</a>
              <span className="mx-1.5 text-brand-ink/30">/</span>
              <span className="text-brand-ink/70">Categories</span>
            </p>
            <h1 className="font-display font-extrabold leading-[1.05] text-[2.2rem] sm:text-[2.7rem]">
              <span className="text-brand-green">ALL</span>{' '}
              <span className="text-brand-ink">AWARD</span>
              <br />
              <span className="text-brand-ink">CATEGORIES</span>
            </h1>
            <p className="text-sm text-brand-ink/60 mt-3 max-w-md leading-relaxed">
              Explore all award categories and support your favorite riders and motorcycles.
            </p>
          </div>

          {/* Hero visuals: motorcycle + trophy */}
          <div className="hidden lg:flex items-end gap-0 relative" style={{ height: 200 }}>
            <img
              src="/hero_motorcycle.jpg"
              alt="3D Motorcycle"
              className="object-contain h-full shadow-sm"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.12))', maxWidth: 260, mixBlendMode: 'multiply' }}
            />
            <img
              src="/hero_trophy.jpg"
              alt="Nduthi Festival Awards Trophy"
              className="object-contain absolute right-0 bottom-0"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(245,197,66,0.25))', height: '80%', maxWidth: 100, mixBlendMode: 'multiply' }}
            />
            {/* Trophy label */}
            <div className="absolute right-1 bottom-0 translate-y-0 bg-brand-ink/80 backdrop-blur rounded-lg px-2 py-1 shadow-lg">
              <p className="text-[8px] font-bold text-brand-gold tracking-wide uppercase leading-tight">NDUTHI FESTIVAL</p>
              <p className="text-[7px] font-semibold text-white/80 tracking-widest uppercase">& AWARDS KENYA</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="container-nd relative pb-7 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm" style={{ zIndex: 3 }}>
          {[
            { label: 'Award Categories', value: String(stats.categories), icon: '🏆' },
            { label: 'Nominees', value: String(stats.nominees), icon: '👤' },
            { label: 'Total Votes Cast', value: stats.totalVotes.toLocaleString(), icon: '📊' },
            { label: 'Registered Voters', value: stats.registeredVoters.toLocaleString(), icon: '✅' },
            { label: 'Days Left to Vote', value: String(stats.daysLeft), icon: '📅' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-white/85 backdrop-blur rounded-xl px-4 py-3.5 border border-black/5 shadow-card">
              <span className="text-xl shrink-0">{s.icon}</span>
              <div>
                <p className="font-display text-base font-extrabold text-brand-ink leading-none">{s.value}</p>
                <p className="text-[10px] text-brand-ink/50 mt-1 leading-none">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 bg-brand-green-light/20">
        <div className="container-nd grid lg:grid-cols-[220px_1fr_280px] gap-6">
          {/* Filter sidebar */}
          <aside className="bg-white rounded-2xl border border-black/5 shadow-card p-5 h-fit hidden lg:block">
            <h3 className="text-xs font-bold text-brand-ink tracking-wider uppercase mb-3">Categories</h3>
            <ul className="space-y-1 text-sm font-semibold">
              <li className="px-3 py-2 rounded-lg bg-brand-green text-white cursor-pointer transition-colors">All Categories</li>
              {categories.map((c) => (
                <li key={c.id} className="px-3 py-2 rounded-lg text-brand-ink/70 hover:bg-black/[0.03] cursor-pointer transition-all duration-200">
                  {c.name}
                  <span className="text-brand-ink/40 text-xs ml-1 font-normal">({c.nomineeCount})</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Category list */}
          <div className="space-y-5">
            {categories.map((cat) => {
              const Icon = ICONS[cat.icon];
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-black/5 shadow-card p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-card-lg transition-all duration-300"
                >
                  {/* Left Column: Overlaid badge and image */}
                  <div className="relative shrink-0 w-24 h-18 rounded-xl overflow-hidden shadow-sm border border-black/5">
                    <img
                      src={CAT_IMAGES[cat.id]}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm ${ACCENT_BG[cat.accent]}`}>
                      <Icon size={11} />
                    </span>
                  </div>

                  {/* Middle Column: Metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-extrabold text-brand-ink leading-snug">{cat.name}</h3>
                    <p className="text-xs text-brand-ink/55 mt-1 leading-relaxed line-clamp-2">{cat.description}</p>
                    <p className="text-[11px] font-bold text-brand-ink/40 mt-2 flex items-center gap-1">
                      <span>👤</span> {cat.nomineeCount} Nominees
                    </p>
                  </div>

                  {/* Right Column: Vote Counts */}
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-display text-lg font-black text-brand-ink leading-none">{cat.totalVotes.toLocaleString()}</p>
                    <p className="text-xs text-brand-green font-bold flex items-center sm:justify-end gap-1 mt-1">
                      <TrendingUp size={12} /> +{cat.changePercent}%
                    </p>
                  </div>

                  {/* Vote CTA Button */}
                  <button
                    onClick={() => castVote('n1', 'John Mwangi', cat.name)}
                    className={`shrink-0 inline-flex items-center justify-center gap-1.5 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm ${ACCENT_BTN[cat.accent]}`}
                  >
                    Vote Now <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-5 hidden lg:block">
            <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className="text-brand-green" />
                <h3 className="text-xs font-bold text-brand-ink tracking-wider uppercase">About Categories</h3>
              </div>
              <p className="text-xs text-brand-ink/55 leading-relaxed mb-4">
                Each category represents excellence in different aspects of motorcycling. Browse through and
                support your favourites by casting your vote.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-brand-ink/70 border-t border-black/5 pt-3">
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-brand-green" /> Transparent Voting</li>
                <li className="flex items-center gap-2"><Lock size={14} className="text-brand-green" /> Secure Payments</li>
                <li className="flex items-center gap-2"><TrendingUp size={14} className="text-brand-green" /> Real-time Results</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-brand-red text-white p-5 shadow-card-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-display font-extrabold text-lg leading-tight">Every Vote Counts!</h3>
                <p className="text-xs text-white/85 mt-2 leading-relaxed">
                  Your vote helps celebrate excellence and inspire more riders in the community.
                </p>
                <a href="#" className="mt-4 inline-flex items-center gap-1.5 bg-white text-brand-red text-xs font-bold px-4 py-2.5 rounded-lg shadow hover:bg-gray-50 transition-colors">
                  Start Voting Now <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
