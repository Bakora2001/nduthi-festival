import { Bike, Trophy, Users, Cog, Camera, Star } from 'lucide-react';
import { categories } from '../data/mockData';
import { CategoryIcon } from '../types';

const ICONS: Record<CategoryIcon, typeof Bike> = {
  rider: Bike,
  trophy: Trophy,
  club: Users,
  industry: Cog,
  camera: Camera,
  star: Star,
};

const ACCENTS: Record<string, string> = {
  green: 'bg-brand-green text-white',
  red: 'bg-brand-red text-white',
  gold: 'bg-brand-gold text-brand-ink',
  blue: 'bg-blue-600 text-white',
  purple: 'bg-purple-600 text-white',
  orange: 'bg-orange-500 text-white',
};

export default function BrowseCategories() {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-ink">Browse Categories</h2>
          <p className="text-sm text-brand-ink/60 mt-1">Explore all award categories</p>
        </div>
        <a href="/categories" className="hidden sm:inline text-sm font-semibold text-brand-green hover:underline">
          View All &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon];
          return (
            <a
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-black/5 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all p-5 flex flex-col items-center text-center gap-3"
            >
              <span className={`w-12 h-12 rounded-full flex items-center justify-center ${ACCENTS[cat.accent]}`}>
                <Icon size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-green transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-brand-ink/50 mt-0.5">{cat.nomineeCount} Categories</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
