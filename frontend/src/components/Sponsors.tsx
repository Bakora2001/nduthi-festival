import { sponsors } from '../data/mockData';

export default function Sponsors() {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="py-12 bg-brand-green-light/40">
      <div className="container-nd">
        <p className="text-center text-xs font-semibold tracking-widest text-brand-ink/50 mb-6">
          OUR PROUD SPONSORS &amp; PARTNERS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-black/5 shadow-card px-6 py-3.5 text-sm font-semibold text-brand-ink/70"
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
