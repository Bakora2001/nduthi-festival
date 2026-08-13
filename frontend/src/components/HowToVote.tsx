import { ShieldCheck } from 'lucide-react';
import { howToVoteSteps } from '../data/mockData';

export default function HowToVote() {
  return (
    <section className="py-14 bg-white">
      <div className="container-nd">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-ink">How to Vote</h2>
            <p className="text-sm text-brand-ink/60 mt-1">It's simple, secure and makes a difference</p>
          </div>
          <a href="/categories" className="hidden sm:inline text-sm font-semibold text-brand-green hover:underline">
            View All Categories &rarr;
          </a>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {howToVoteSteps.map((s, i) => (
            <div key={s.step} className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white ${
                  i % 2 === 0 ? 'bg-brand-green' : 'bg-brand-red'
                }`}
              >
                {s.step}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-brand-ink">{s.title}</h3>
              <p className="mt-1.5 text-xs text-brand-ink/55 leading-relaxed">{s.description}</p>
              {i < howToVoteSteps.length - 1 && (
                <span className="hidden lg:block absolute top-5 left-[calc(100%+0.75rem)] w-[calc(100%-1.5rem)] border-t border-dashed border-black/10" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 bg-brand-green-light rounded-xl px-5 py-4">
          <ShieldCheck size={20} className="text-brand-green shrink-0" />
          <p className="text-sm text-brand-ink/75">
            <span className="font-semibold text-brand-ink">Every vote is verified, secure and transparent.</span>{' '}
            You pay. You vote. You make a difference.
          </p>
        </div>
      </div>
    </section>
  );
}
