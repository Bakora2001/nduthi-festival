import { Bike, Trophy, Users, Cog, Camera, Star } from 'lucide-react';
import { useVote } from '../context/VoteContext';

const ICONS: Record<string, typeof Bike> = {
  rider: Bike,
  trophy: Trophy,
  club: Users,
  industry: Cog,
  camera: Camera,
  star: Star,
};

const ACCENTS = ['bg-brand-green text-white', 'bg-brand-red text-white', 'bg-brand-gold text-brand-ink', 'bg-blue-600 text-white', 'bg-purple-600 text-white', 'bg-orange-500 text-white'];

export default function BrowseCategories() {
  const { categories, nominees } = useVote();

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-ink">Browse Award Categories</h2>
          <p className="text-sm text-brand-ink/60 mt-1">Explore all award categories and participants</p>
        </div>
        <a href="/categories" className="hidden sm:inline text-sm font-semibold text-brand-green hover:underline">
          View All &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const Icon = (cat.icon && ICONS[cat.icon]) ? ICONS[cat.icon] : Trophy;
          const nomineeCount = nominees.filter((n) => n.categoryId === cat.id).length;
          const accentStyle = ACCENTS[idx % ACCENTS.length];

          return (
            <a
              key={cat.id}
              href="/categories"
              className="group bg-white rounded-2xl border border-black/5 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all p-5 flex flex-col items-center text-center gap-3"
            >
              <span className={`w-12 h-12 rounded-full flex items-center justify-center ${accentStyle}`}>
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-green transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-brand-ink/50 mt-0.5">{nomineeCount} Participants</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
