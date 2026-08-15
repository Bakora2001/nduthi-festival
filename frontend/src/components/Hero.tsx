import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Calendar, ChevronRight } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';

const FESTIVAL_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 23 + 1000 * 60 * 60 * 14);

export default function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(FESTIVAL_DATE);

  return (
    /**
     * Full-bleed section. Everything is absolutely positioned in layers.
     * Layout zones (matching reference image):
     *  [LEFT 0-38%] white bg + text copy
     *  [CENTER 25-72%] large motorcycle image
     *  [RIGHT 62-100%] Kenyan flag + trophy + countdown card
     */
    <section
      className="relative overflow-hidden bg-white"
      style={{ minHeight: 560 }}
    >
      {/* ── BG LAYER 1: Kenyan flag fills the right portion ── */}
      <img
        src="/hero_flag_bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 h-full"
        style={{
          zIndex: 1,
          width: '52%',
          objectFit: 'cover',
          objectPosition: 'left center',
        }}
      />

      {/* ── BG LAYER 2: White fade from left, keeps text readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #ffffff 0%, #ffffff 36%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.1) 68%, rgba(255,255,255,0) 82%)',
          zIndex: 2,
        }}
      />

      {/* ── LAYER 3: Confetti dots (Kenya colours) ── */}
      <ConfettiDots />

      {/* ── LAYER 4: Motorcycle — large, centered between text and flag ── */}
      <motion.img
        src="/hero_motorcycle.jpg"
        alt="3D Sport Motorcycle"
        className="absolute pointer-events-none select-none"
        style={{
          zIndex: 5,
          /* Horizontally: start at ~28% from left, extend right */
          left: '28%',
          right: '22%',
          /* Vertically: sit from top, bottom just above countdown */
          top: '2%',
          bottom: '6%',
          width: 'auto',
          height: '92%',
          maxWidth: '58%',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          /* Strips the white JPG background — shows flag through */
          mixBlendMode: 'multiply',
          filter: 'contrast(1.1) saturate(1.1)',
        }}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
      />

      {/* ── LAYER 7: Left text content ── */}
      <div className="container-nd relative" style={{ zIndex: 7 }}>
        <div className="pt-10 pb-32" style={{ maxWidth: '42%', minWidth: 300 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="font-display font-extrabold leading-[1.06] tracking-tight text-[2.4rem] sm:text-[2.9rem]">
              <span className="text-brand-green">Celebrating</span>
              <br />
              <span className="text-brand-green">Excellence,</span>
              <br />
              <span className="text-brand-ink">Promoting Safety,</span>
              <br />
              <span className="text-brand-red">Inspiring Riders</span>
            </h1>

            <p className="mt-4 text-[14px] text-brand-ink/65 max-w-[340px] leading-relaxed">
              Join thousands of riders, fans and partners in celebrating the best
              in the motorcycle community across Kenya.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-green text-white text-sm font-bold shadow-card-lg hover:bg-brand-green-dark transition-all duration-200 hover:scale-[1.03]"
              >
                View Categories <ArrowRight size={15} />
              </a>
              <a
                href="/how-to-vote"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-black/15 text-sm font-semibold text-brand-ink hover:border-brand-green hover:text-brand-green transition-colors"
              >
                <PlayCircle size={15} /> How to Vote
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── LAYER 8: Countdown card — bottom right ── */}
      <motion.div
        className="absolute"
        style={{ zIndex: 8, bottom: '5%', right: '3%' }}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.5 }}
      >
        <div className="rounded-2xl px-4 py-4 w-56 bg-white shadow-card-lg border border-black/6">
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar size={12} className="text-brand-green" />
            <p className="text-[10px] font-bold text-brand-ink/50 tracking-widest uppercase">
              Festival Countdown
            </p>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { label: 'DAYS',  value: days },
              { label: 'HRS',   value: hours },
              { label: 'MINS',  value: minutes },
              { label: 'SECS',  value: seconds },
            ].map((t) => (
              <div key={t.label} className="rounded-lg py-1.5 bg-brand-ink/[0.04]">
                <span className="font-display text-[1.2rem] font-black text-brand-red block leading-none">
                  {String(t.value).padStart(2, '0')}
                </span>
                <span className="text-[8px] font-semibold text-brand-ink/40 tracking-wider">
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-black/6 space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-brand-ink/50">Event Date</span>
              <span className="text-brand-green font-semibold">To Be Confirmed</span>
            </div>
            <a
              href="/event-details"
              className="flex items-center justify-between text-[10px] text-brand-ink/45 hover:text-brand-green transition-colors"
            >
              <span>Event Details</span>
              <ChevronRight size={11} />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* Scattered confetti dots in Kenya colours */
function ConfettiDots() {
  const dots = [
    { x: '5%',  y: '8%',  c: '#0B8E36', s: 9  },
    { x: '11%', y: '75%', c: '#D61F26', s: 6  },
    { x: '20%', y: '88%', c: '#F5C542', s: 10 },
    { x: '38%', y: '4%',  c: '#D61F26', s: 7  },
    { x: '52%', y: '80%', c: '#0B8E36', s: 8  },
    { x: '70%', y: '6%',  c: '#F5C542', s: 6  },
    { x: '85%', y: '78%', c: '#D61F26', s: 7  },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ left: d.x, top: d.y, width: d.s, height: d.s, background: d.c, opacity: 0.6 }}
        />
      ))}
    </div>
  );
}
