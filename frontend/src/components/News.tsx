import { ArrowRight } from 'lucide-react';
import { newsItems } from '../data/mockData';

export default function News() {
  return (
    <section className="py-14 bg-white">
      <div className="container-nd grid lg:grid-cols-[1.6fr_1fr] gap-8">
        <div>
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-brand-ink">Latest News &amp; Updates</h2>
            <a href="/news" className="text-sm font-semibold text-brand-green hover:underline whitespace-nowrap">
              View All News &rarr;
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {newsItems.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="group rounded-2xl border border-black/5 shadow-card hover:shadow-card-lg transition-shadow p-5 flex flex-col"
              >
                <span className="inline-block text-[11px] font-semibold text-brand-green bg-brand-green-light px-2.5 py-1 rounded-full self-start mb-3">
                  {item.date}
                </span>
                <h3 className="text-sm font-semibold text-brand-ink leading-snug group-hover:text-brand-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-ink/55 mt-2 flex-1">{item.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-red">
                  Read More <ArrowRight size={13} />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-brand-red text-white p-7 flex flex-col justify-between relative overflow-hidden">
          <div className="hero-flag-strip absolute -right-6 -bottom-10 w-24 h-24 rounded-full opacity-25" />
          <div>
            <h3 className="font-display text-2xl font-bold leading-tight">
              Your Vote
              <br />
              Counts!
            </h3>
            <p className="text-sm text-white/85 mt-3 leading-relaxed">
              Support your favourite riders and help celebrate excellence in the riding community.
            </p>
          </div>
          <a
            href="/categories"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-brand-red font-semibold text-sm px-5 py-3 rounded-lg hover:bg-brand-gold hover:text-brand-ink transition-colors w-fit"
          >
            Vote Now <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
