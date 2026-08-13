import { Star, Users, BarChart3, UserCheck, Eye, Calendar } from 'lucide-react';
import { stats } from '../data/mockData';

const ITEMS = [
  { icon: Star, label: 'Award Categories', value: stats.categories.toLocaleString(), color: 'text-brand-green' },
  { icon: Users, label: 'Nominees', value: stats.nominees.toLocaleString(), color: 'text-brand-red' },
  { icon: BarChart3, label: 'Total Votes', value: stats.totalVotes.toLocaleString(), color: 'text-brand-ink' },
  { icon: UserCheck, label: 'Registered Voters', value: stats.registeredVoters.toLocaleString(), color: 'text-brand-red' },
  { icon: Eye, label: 'Live Visitors', value: stats.liveVisitors.toLocaleString(), color: 'text-brand-green' },
  { icon: Calendar, label: 'Days Left', value: String(stats.daysLeft), color: 'text-brand-gold-dark' },
];

export default function StatsBar() {
  return (
    <section className="border-y border-black/5 bg-white">
      <div className="container-nd py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
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
