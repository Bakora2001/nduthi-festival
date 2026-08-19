export interface OfficialCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  fee: number;
  coverImage: string;
}

export const OFFICIAL_CATEGORIES: OfficialCategory[] = [
  {
    id: 'cat-001-kenya',
    name: '001 Kenya',
    slug: '001-kenya',
    description: 'The supreme championship honour celebrating the most distinguished icon in the Kenyan motorcycle fraternity.',
    icon: 'trophy',
    fee: 1000,
    coverImage: '/cat_rider_awards.jpg',
  },
  {
    id: 'cat-rider-of-the-year',
    name: 'Rider of the Year',
    slug: 'rider-of-the-year',
    description: 'Honouring the most outstanding individual rider who has demonstrated exceptional skill, road safety, and community leadership.',
    icon: 'rider',
    fee: 1000,
    coverImage: '/cat_rider_awards.jpg',
  },
  {
    id: 'cat-nduthi-blogger',
    name: 'Nduthi Blogger of the Year',
    slug: 'nduthi-blogger-of-the-year',
    description: 'Recognizing top digital creators, vloggers, and bloggers promoting biker culture, road safety, and lifestyle.',
    icon: 'camera',
    fee: 500,
    coverImage: '/cat_media.jpg',
  },
  {
    id: 'cat-best-rider-group',
    name: 'Best Rider group',
    slug: 'best-rider-group',
    description: 'Celebrating organized riding clubs and groups championing unity, disciplined riding, and brotherhood.',
    icon: 'club',
    fee: 5000,
    coverImage: '/cat_riders_club.jpg',
  },
  {
    id: 'cat-best-customized-nduthi',
    name: 'Best customized nduthi',
    slug: 'best-customized-nduthi',
    description: 'Awarding the most creative, stylish, and meticulously modified motorcycle with unmatched aesthetics.',
    icon: 'industry',
    fee: 500,
    coverImage: '/nominee_bike_2.jpg',
  },
  {
    id: 'cat-best-mechanic',
    name: 'Best mechanic of theYear',
    slug: 'best-mechanic-of-the-year',
    description: 'Recognizing master technicians and mechanics providing exceptional motorcycle repair, tuning, and maintenance.',
    icon: 'industry',
    fee: 500,
    coverImage: '/cat_industry.jpg',
  },
  {
    id: 'cat-best-motorcycle-dealer',
    name: 'Best Motorcycle dealer of the Year',
    slug: 'best-motorcycle-dealer-of-the-year',
    description: 'Honouring leading motorcycle dealerships and distributors delivering quality bikes, parts, and customer service.',
    icon: 'trophy',
    fee: 1000,
    coverImage: '/cat_industry.jpg',
  },
  {
    id: 'cat-best-female-rider',
    name: 'Best Female Rider of Year',
    slug: 'best-female-rider-of-year',
    description: 'Celebrating inspiring women riders who break boundaries, inspire others, and excel on two wheels.',
    icon: 'star',
    fee: 500,
    coverImage: '/cat_rider_awards.jpg',
  },
  {
    id: 'cat-peoples-choice',
    name: "People's Choice of the Year",
    slug: 'peoples-choice-of-the-year',
    description: 'The overall crowd favourite decided purely by public votes across Kenya.',
    icon: 'star',
    fee: 500,
    coverImage: '/cat_special.jpg',
  },
  {
    id: 'cat-best-charity',
    name: 'Best Charity initiative od the Year',
    slug: 'best-charity-initiative-of-the-year',
    description: 'Recognizing biker-led philanthropic activities, community service, medical drives, and charity tours.',
    icon: 'star',
    fee: 500,
    coverImage: '/cat_special.jpg',
  },
];

export function getCategoryFeeByObject(category?: { name?: string; slug?: string } | null): number {
  if (!category || !category.name) return 500;
  const name = category.name.toLowerCase().trim();
  const slug = (category.slug || '').toLowerCase().trim();

  // 1. 001 Kenya, Rider of the Year, Best Motorcycle dealer of the Year -> KES 1000
  if (
    name.includes('001') || slug.includes('001') ||
    name.includes('rider of the year') || slug.includes('rider-of-the-year') ||
    name.includes('dealer') || slug.includes('dealer')
  ) {
    return 1000;
  }

  // 2. Best Rider group -> KES 5000
  if (
    name.includes('group') || slug.includes('group') ||
    name.includes('club') || slug.includes('club')
  ) {
    return 5000;
  }

  // 3. Other categories -> KES 500
  return 500;
}
