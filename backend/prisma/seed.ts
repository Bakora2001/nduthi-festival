import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database for fresh production start...');

  // Delete in dependency order
  await prisma.vote.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.motorcycleImage.deleteMany({});
  await prisma.numberPlateImage.deleteMany({});
  await prisma.nominee.deleteMany({});
  await prisma.motorcycle.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.role.deleteMany({});

  console.log('Seeding standard roles...');
  const roleNames: RoleName[] = ['SUPER_ADMIN', 'JUDGE', 'SPONSOR', 'NOMINEE', 'REGISTERED_VOTER', 'GUEST_VISITOR'];
  const roles: Record<string, string> = {};

  for (const name of roleNames) {
    const role = await prisma.role.create({ data: { name } });
    roles[name] = role.id;
  }

  console.log('Seeding Super Admin account...');
  const adminPasswordHash = await bcrypt.hash('NduthiAdmin2025!', 12);

  await prisma.user.create({
    data: {
      firstName: 'Nduthi',
      lastName: 'Admin',
      email: 'nduthifestivalkenya@gmail.com',
      phone: '+254700000000',
      passwordHash: adminPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@nduthiawards.co.ke',
      phone: '+254711000000',
      passwordHash: adminPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  console.log('Seeding 10 official award categories...');
  const officialCategories = [
    {
      name: '001 Kenya',
      slug: '001-kenya',
      icon: 'trophy',
      description: 'The supreme championship honour celebrating the most distinguished icon in the Kenyan motorcycle fraternity.',
      coverImage: '/cat_rider_awards.jpg',
    },
    {
      name: 'Rider of the Year',
      slug: 'rider-of-the-year',
      icon: 'rider',
      description: 'Honouring the most outstanding individual rider who has demonstrated exceptional skill, road safety, and community leadership.',
      coverImage: '/cat_motorcycle.jpg',
    },
    {
      name: 'Nduthi Blogger of the Year',
      slug: 'nduthi-blogger-of-the-year',
      icon: 'camera',
      description: 'Recognizing top digital creators, vloggers, and bloggers promoting biker culture, road safety, and lifestyle.',
      coverImage: '/cat_media.jpg',
    },
    {
      name: 'Best Rider group',
      slug: 'best-rider-group',
      icon: 'club',
      description: 'Celebrating organized riding clubs and groups championing unity, disciplined riding, and brotherhood.',
      coverImage: '/cat_clubs.jpg',
    },
    {
      name: 'Best customized nduthi',
      slug: 'best-customized-nduthi',
      icon: 'wrench',
      description: 'Awarding the most creative, stylish, and meticulously modified motorcycle with unmatched aesthetics.',
      coverImage: '/cat_motorcycle.jpg',
    },
    {
      name: 'Best mechanic of theYear',
      slug: 'best-mechanic-of-the-year',
      icon: 'wrench',
      description: 'Recognizing master technicians and mechanics providing exceptional motorcycle repair, tuning, and maintenance.',
      coverImage: '/cat_industry.jpg',
    },
    {
      name: 'Best Motorcycle dealer of the Year',
      slug: 'best-motorcycle-dealer-of-the-year',
      icon: 'industry',
      description: 'Honouring leading motorcycle dealerships and distributors delivering quality bikes, parts, and customer service.',
      coverImage: '/cat_industry.jpg',
    },
    {
      name: 'Best Female Rider of Year',
      slug: 'best-female-rider-of-year',
      icon: 'star',
      description: 'Celebrating inspiring women riders who break boundaries, inspire others, and excel on two wheels.',
      coverImage: '/cat_rider_awards.jpg',
    },
    {
      name: 'People\'s Choice of the Year',
      slug: 'peoples-choice-of-the-year',
      icon: 'star',
      description: 'The overall crowd favourite decided purely by public votes across Kenya.',
      coverImage: '/cat_special.jpg',
    },
    {
      name: 'Best Charity initiative od the Year',
      slug: 'best-charity-initiative-of-the-year',
      icon: 'heart',
      description: 'Recognizing biker-led philanthropic activities, community service, medical drives, and charity tours.',
      coverImage: '/cat_special.jpg',
    },
  ];

  for (const cat of officialCategories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        coverImage: cat.coverImage,
        isActive: true,
      },
    });
  }

  console.log('Database cleaned and 10 official categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
