import { Category, LeaderboardEntry, Nominee, NewsItem, Sponsor } from '../types';

// This mirrors the shape returned by GET /api/categories, GET /api/nominees/top,
// and GET /api/votes/leaderboard — swap for real API calls once the backend
// is running (see src/lib/api.ts).

export const stats = {
  categories: 12,
  nominees: 87,
  totalVotes: 24560,
  registeredVoters: 5432,
  liveVisitors: 2430,
  daysLeft: 10,
};

export const categories: Category[] = [
  { id: '1', name: 'Rider Awards', slug: 'rider-awards', description: 'Honouring outstanding riders who have demonstrated exceptional skills, safety and contribution to the riding community.', icon: 'rider', accent: 'green', nomineeCount: 8, totalVotes: 8450, changePercent: 15.2 },
  { id: '2', name: 'Motorcycle Excellence', slug: 'motorcycle-excellence', description: 'Celebrating the best motorcycles in various categories for performance, design and innovation.', icon: 'trophy', accent: 'red', nomineeCount: 6, totalVotes: 7860, changePercent: 12.7 },
  { id: '3', name: 'Riders Clubs', slug: 'riders-clubs', description: 'Recognizing rider clubs that promote unity, safety, mentorship and community development.', icon: 'club', accent: 'gold', nomineeCount: 3, totalVotes: 5320, changePercent: 8.4 },
  { id: '4', name: 'Industry Awards', slug: 'industry-awards', description: 'Acknowledging organizations and individuals making significant impact in the motorcycle industry.', icon: 'industry', accent: 'blue', nomineeCount: 7, totalVotes: 2980, changePercent: 6.1 },
  { id: '5', name: 'Media Awards', slug: 'media-awards', description: 'Honouring media houses and content creators promoting motorcycle culture and safety.', icon: 'camera', accent: 'purple', nomineeCount: 4, totalVotes: 1780, changePercent: 5.3 },
  { id: '6', name: 'Special Honours', slug: 'special-honours', description: 'Special recognition awards for lifetime achievement and outstanding contributions.', icon: 'star', accent: 'gold', nomineeCount: 2, totalVotes: 170, changePercent: 2.2 },
];

export const liveResultsPreview: Nominee[] = [
  { id: 'n1', name: 'John Mwangi', categoryName: 'Rider of the Year', imageType: 'motorcycle', imageLabel: 'gold', votes: 2458, rank: 1 },
  { id: 'n2', name: 'Riders Clubs', categoryName: 'Best Modified Motorcycle', imageType: 'plate', imageLabel: 'KMG 458X', votes: 1845, rank: 2 },
  { id: 'n3', name: 'James Odhiambo', categoryName: 'Safest Rider', imageType: 'motorcycle', imageLabel: 'silver', votes: 1945, rank: 3 },
  { id: 'n4', name: 'Nairobi Riders', categoryName: 'Best Riders Club', imageType: 'motorcycle', imageLabel: 'group', votes: 1862, rank: 4 },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'John Mwangi', category: 'Rider of the Year', votes: 2458 },
  { rank: 2, name: 'James Odhiambo', category: 'Rider of the Year', votes: 1945 },
  { rank: 3, name: 'Peter Kimani', category: 'Rider of the Year', votes: 1845 },
  { rank: 4, name: 'David Kiptoo', category: 'Rider of the Year', votes: 1622 },
  { rank: 5, name: 'Kelvin Wanjala', category: 'Rider of the Year', votes: 1432 },
];

export const sponsors: Sponsor[] = [];

export const newsItems: NewsItem[] = [
  { id: 'a1', title: 'Nduthi Festival 2025 Date Announced!', excerpt: 'The biggest motorcycle celebration is coming to your county.', date: 'May 20, 2025' },
  { id: 'a2', title: 'Road Safety Campaigns Kick Off Across Counties', excerpt: 'Promoting responsible riding and safer roads for all.', date: 'May 18, 2025' },
  { id: 'a3', title: 'Sponsorship Opportunities Now Open', excerpt: 'Partner with us and be part of this great movement.', date: 'May 15, 2025' },
];

export const howToVoteSteps = [
  { step: 1, title: 'Choose a Category', description: 'Browse through award categories and select your favourite nominee.' },
  { step: 2, title: 'Make Payment', description: 'Complete payment securely via M-Pesa, Airtel Money or Card.' },
  { step: 3, title: 'Login / Register', description: 'Log in or create an account to continue your voting.' },
  { step: 4, title: 'Cast Your Vote', description: 'Your vote is recorded and counted immediately.' },
  { step: 5, title: 'See Live Results', description: 'Results update in real-time for everyone to see!' },
];
