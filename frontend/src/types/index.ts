export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: CategoryIcon;
  accent: 'green' | 'red' | 'gold' | 'blue' | 'purple' | 'orange';
  nomineeCount: number;
  totalVotes: number;
  changePercent: number;
}

export type CategoryIcon = 'rider' | 'trophy' | 'club' | 'industry' | 'camera' | 'star';

export interface Nominee {
  id: string;
  name: string;
  categoryName: string;
  imageType: 'motorcycle' | 'plate';
  imageLabel: string;
  registration?: string;
  owner?: string;
  county?: string;
  votes: number;
  rank: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  category: string;
  votes: number;
}

export interface Sponsor {
  id: string;
  name: string;
  tier?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

export interface StatBlock {
  label: string;
  value: string;
}
