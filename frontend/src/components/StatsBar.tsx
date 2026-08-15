import { Star, Users, BarChart3, MapPin, Sparkles } from 'lucide-react';
import { useVote } from '../context/VoteContext';

export default function StatsBar() {
  const { categories, nominees, totalVotes } = useVote();

  const ITEMS = [
    { icon: Star, label: 'Award Categories', value: categories.length.toLocaleString(), color: 'text-brand-green' },
    { icon: Users, label: 'Registered Nominees', value: nominees.length.toLocaleString(), color: 'text-brand-red' },
    { icon: BarChart3, label: 'Total Votes Cast', value: totalVotes.toLocaleString(), color: 'text-brand-ink' },
    { icon: MapPin, label: 'Edition Location', value: 'Eldoret, Kenya', color: 'text-brand-gold-dark' },
  ];

  return (
    <section className="border-y border-black/5 bg-white">
      <div className="container-nd py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon size={20} className={item.color} strokeWidth={2.2} />
            <div>
              <p className="font-display text-lg font-bold text-brand-ink leading-none">{item.value}</p>
              <p className="text-xs text-brand-ink/50 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
