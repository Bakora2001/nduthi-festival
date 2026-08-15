import { motion } from 'framer-motion';
import { useState } from 'react';
import { useVote } from '../context/VoteContext';
import { Vote, ZoomIn } from 'lucide-react';
import ImageModal, { ImageModalData } from './ImageModal';

const RANK_STYLES: Record<number, { bg: string; ring: string }> = {
  1: { bg: 'bg-[#F5C542]', ring: 'ring-[#F5C542]/20' },
  2: { bg: 'bg-slate-300', ring: 'ring-slate-300/30' },
  3: { bg: 'bg-amber-700', ring: 'ring-amber-700/20' },
  4: { bg: 'bg-brand-ink/30', ring: 'ring-black/5' },
};

export default function LiveResults() {
  const { nominees, castVote, isVotingEnabled } = useVote();
  const [selectedImageNominee, setSelectedImageNominee] = useState<ImageModalData | null>(null);
  const maxVotes = Math.max(...nominees.map((n) => n.votes), 1);

  if (nominees.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container-nd">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-extrabold text-brand-ink tracking-tight">LIVE LEADERBOARD</h2>
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
                      {nominee.rank || (i + 1)}
                    </span>
                    <p className="text-[10px] font-extrabold text-brand-ink/50 tracking-wider uppercase truncate">
                      {nominee.categoryName}
                    </p>
                  </div>

                  {/* Nominee details with Click-to-Zoom */}
                  <div className="flex gap-4 items-center mb-4">
                    <div
                      onClick={() => setSelectedImageNominee({
                        imageUrl: nominee.img || '/cat_rider_awards.jpg',
                        name: nominee.name,
                        categoryName: nominee.categoryName,
                        county: nominee.county,
                        make: nominee.make,
                        model: nominee.model,
                        registrationPlate: nominee.registrationPlate,
                      })}
                      className="relative cursor-pointer group shrink-0"
                      title="Click to view full photo"
                    >
                      <img
                        src={nominee.img || '/cat_rider_awards.jpg'}
                        alt={nominee.name}
                        className="w-[88px] h-[64px] object-cover rounded-xl shadow-sm border border-black/5 group-hover:scale-105 transition-all duration-200"
                      />
                      <div className="absolute inset-0 bg-black/35 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-[1px]">
                        <ZoomIn size={16} />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p
                        onClick={() => setSelectedImageNominee({
                          imageUrl: nominee.img || '/cat_rider_awards.jpg',
                          name: nominee.name,
                          categoryName: nominee.categoryName,
                          county: nominee.county,
                          make: nominee.make,
                          model: nominee.model,
                          registrationPlate: nominee.registrationPlate,
                        })}
                        className="text-sm font-bold text-brand-ink truncate leading-snug cursor-pointer hover:text-brand-green transition-colors"
                      >
                        {nominee.name}
                      </p>
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
                  onClick={() => castVote(nominee.id, nominee.name, nominee.categoryName)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold shadow-card flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    isVotingEnabled
                      ? 'bg-brand-green text-white hover:bg-brand-green-dark'
                      : 'bg-black/5 text-brand-ink/60 border border-black/5 hover:bg-black/10'
                  }`}
                >
                  {isVotingEnabled ? (
                    <>
                      <Vote size={13} /> Vote
                    </>
                  ) : (
                    <span>⏳ Voting Opens Soon</span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Resolution Photo Lightbox Modal */}
      <ImageModal
        isOpen={!!selectedImageNominee}
        data={selectedImageNominee}
        onClose={() => setSelectedImageNominee(null)}
      />
    </section>
  );
}
