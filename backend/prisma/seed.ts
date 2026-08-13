import { PrismaClient, RoleName, PaymentMethod, PaymentStatus, NomineeImageType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles...');
  const roleNames: RoleName[] = ['SUPER_ADMIN', 'JUDGE', 'SPONSOR', 'NOMINEE', 'REGISTERED_VOTER', 'GUEST_VISITOR'];
  const roles: Record<string, string> = {};

  for (const name of roleNames) {
    const role = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
    roles[name] = role.id;
  }

  console.log('Seeding super admin users...');
  const adminPasswordHash = await bcrypt.hash('NduthiAdmin2025!', 12);
  
  await prisma.user.upsert({
    where: { email: 'nduthifestivalkenya@gmail.com' },
    update: { passwordHash: adminPasswordHash, isEmailVerified: true, roleId: roles.SUPER_ADMIN },
    create: {
      firstName: 'Nduthi',
      lastName: 'Admin',
      email: 'nduthifestivalkenya@gmail.com',
      passwordHash: adminPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@nduthiawards.co.ke' },
    update: { passwordHash: adminPasswordHash, isEmailVerified: true },
    create: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@nduthiawards.co.ke',
      passwordHash: adminPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  console.log('Seeding official award categories...');
  const categoryDefs = [
    { name: 'Rider Awards', slug: 'rider-awards', icon: 'rider', description: 'Honouring outstanding riders who have demonstrated exceptional skills, safety and contribution to the riding community.' },
    { name: 'Motorcycle Excellence', slug: 'motorcycle-excellence', icon: 'trophy', description: 'Celebrating the best motorcycles in various categories for performance, design and innovation.' },
    { name: 'Riders Clubs', slug: 'riders-clubs', icon: 'club', description: 'Recognizing rider clubs that promote unity, safety, mentorship and community development.' },
    { name: 'Industry Awards', slug: 'industry-awards', icon: 'industry', description: 'Acknowledging organizations and individuals making significant impact in the motorcycle industry.' },
    { name: 'Media Awards', slug: 'media-awards', icon: 'camera', description: 'Honouring media houses and content creators promoting motorcycle culture and safety.' },
    { name: 'Special Honours', slug: 'special-honours', icon: 'star', description: 'Special recognition awards for lifetime achievement and outstanding contributions.' },
  ];

  for (const cat of categoryDefs) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
