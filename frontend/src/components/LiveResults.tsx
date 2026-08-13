import { motion } from 'framer-motion';
import { useVote } from '../context/VoteContext';
import { Vote } from 'lucide-react';

const RANK_STYLES: Record<number, { bg: string; ring: string }> = {
  1: { bg: 'bg-[#F5C542]', ring: 'ring-[#F5C542]/20' },
  2: { bg: 'bg-slate-300', ring: 'ring-slate-300/30' },
  3: { bg: 'bg-amber-700', ring: 'ring-amber-700/20' },
  4: { bg: 'bg-brand-ink/30', ring: 'ring-black/5' },
};

const CATEGORY_LABELS = ['RIDER OF THE YEAR', 'BEST MODIFIED MOTORCYCLE', 'SAFEST RIDER', 'BEST RIDERS CLUB'];

export default function LiveResults() {
  const { nominees, castVote } = useVote();
  const maxVotes = Math.max(...nominees.map((n) => n.votes), 1);

  return (
    <section className="py-12 bg-white">
      <div className="container-nd">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-extrabold text-brand-ink tracking-tight">LIVE RESULTS</h2>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              Updating in real-time
            </span>
          </div>
          <a href="/live-results" className="text-xs font-bold text-brand-ink hover:text-brand-green transition-colors flex items-center gap-1">
            View All Results <span className="text-[14px]">&rarr;</span>
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nominees.slice(0, 4).map((nominee, i) => {
            const rankStyle = RANK_STYLES[nominee.rank] ?? RANK_STYLES[4];
            const pct = Math.round((nominee.votes / maxVotes) * 100);
            return (
              <motion.div
                key={nominee.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-black/5 shadow-card p-5 hover:shadow-card-lg transition-all duration-300 bg-white flex flex-col justify-between"
              >
                <div>
                  {/* Header: Rank + Category Label */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-6 h-6 rounded-full ${rankStyle.bg} ring-4 ${rankStyle.ring} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                      {nominee.rank}
                    </span>
                    <p className="text-[10px] font-extrabold text-brand-ink/50 tracking-wider uppercase truncate">
                      {CATEGORY_LABELS[i] ?? nominee.categoryName}
                    </p>
                  </div>

                  {/* Nominee details: image left, text right */}
                  <div className="flex gap-4 items-center mb-4">
                    <img
                      src={nominee.img}
                      alt={nominee.name}
                      className="w-[88px] h-[64px] object-cover rounded-xl shadow-sm border border-black/5 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-ink truncate leading-snug">{nominee.name}</p>
                      <p className="font-display text-base font-extrabold text-brand-green mt-0.5">
                        {nominee.votes.toLocaleString()}{' '}
                        <span className="text-[11px] font-semibold text-brand-ink/50 lowercase">Votes</span>
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-brand-ink/[0.04] overflow-hidden mb-4">
                    <div className="h-full rounded-full bg-brand-green transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Vote CTA Button */}
                <button
                  onClick={() => castVote(nominee.id, nominee.name, CATEGORY_LABELS[i])}
                  className="w-full py-2 px-3 rounded-xl bg-brand-green text-white text-xs font-bold shadow-card flex items-center justify-center gap-1.5 hover:bg-brand-green-dark transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <Vote size={13} /> Vote Now
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
