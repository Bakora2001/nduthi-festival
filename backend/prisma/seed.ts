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

  console.log('Seeding admin users...');
  const adminPasswordHash = await bcrypt.hash('ChangeMe123!', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nduthiawards.co.ke' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@nduthiawards.co.ke',
      passwordHash: adminPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  const lukasPasswordHash = await bcrypt.hash('Nduthi@Admin2025!', 12);
  await prisma.user.upsert({
    where: { email: 'lukasadmin@gmail.com' },
    update: { passwordHash: lukasPasswordHash, isEmailVerified: true },
    create: {
      firstName: 'Lukas',
      lastName: 'Admin',
      email: 'lukasadmin@gmail.com',
      passwordHash: lukasPasswordHash,
      isEmailVerified: true,
      roleId: roles.SUPER_ADMIN,
    },
  });

  console.log('Seeding sample voter...');
  const voterPasswordHash = await bcrypt.hash('Voter123!', 12);
  const sampleVoter = await prisma.user.upsert({
    where: { email: 'voter@nduthiawards.co.ke' },
    update: {},
    create: {
      firstName: 'Brian',
      lastName: 'Mwangi',
      email: 'voter@nduthiawards.co.ke',
      phone: '+254712345678',
      passwordHash: voterPasswordHash,
      isEmailVerified: true,
      roleId: roles.REGISTERED_VOTER,
    },
  });

  console.log('Seeding award categories...');
  const categoryDefs = [
    { name: 'Rider Awards', slug: 'rider-awards', icon: 'rider', description: 'Honouring outstanding riders who have demonstrated exceptional skills, safety and contribution to the riding community.' },
    { name: 'Motorcycle Excellence', slug: 'motorcycle-excellence', icon: 'trophy', description: 'Celebrating the best motorcycles in various categories for performance, design and innovation.' },
    { name: 'Riders Clubs', slug: 'riders-clubs', icon: 'club', description: 'Recognizing rider clubs that promote unity, safety, mentorship and community development.' },
    { name: 'Industry Awards', slug: 'industry-awards', icon: 'industry', description: 'Acknowledging organizations and individuals making significant impact in the motorcycle industry.' },
    { name: 'Media Awards', slug: 'media-awards', icon: 'camera', description: 'Honouring media houses and content creators promoting motorcycle culture and safety.' },
    { name: 'Special Honours', slug: 'special-honours', icon: 'star', description: 'Special recognition awards for lifetime achievement and outstanding contributions.' },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categoryDefs) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    catMap[cat.slug] = c.id;
  }

  console.log('Seeding real Boda Boda nominees & motorcycles...');
  const nomineesData = [
    // Rider Awards
    { name: 'John Mwangi', county: 'Nairobi', ownerName: 'John Mwangi', categoryId: catMap['rider-awards'], plate: 'KMG 458X', make: 'Honda', model: 'CB150', voteCount: 2458, isFeatured: true },
    { name: 'James Odhiambo', county: 'Kisumu', ownerName: 'James Odhiambo', categoryId: catMap['rider-awards'], plate: 'KMD 782P', make: 'TVS', model: 'HLX 150', voteCount: 1945, isFeatured: true },
    { name: 'Peter Kimani', county: 'Nakuru', ownerName: 'Peter Kimani', categoryId: catMap['rider-awards'], plate: 'KMH 119Q', make: 'Boxer', model: 'BM150', voteCount: 1622, isFeatured: true },
    { name: 'David Kiptoo', county: 'Uasin Gishu', ownerName: 'David Kiptoo', categoryId: catMap['rider-awards'], plate: 'KMJ 304V', make: 'Suzuki', model: 'TF125', voteCount: 1510, isFeatured: true },
    { name: 'Kevin Wanjala', county: 'Bungoma', ownerName: 'Kevin Wanjala', categoryId: catMap['rider-awards'], plate: 'KMC 882W', make: 'Yamaha', model: 'Crux 110', voteCount: 1320, isFeatured: true },
    { name: 'Hassan Omar', county: 'Mombasa', ownerName: 'Hassan Omar', categoryId: catMap['rider-awards'], plate: 'KMA 501Y', make: 'TVS', model: 'Star HLX 125', voteCount: 980, isFeatured: false },

    // Motorcycle Excellence
    { name: 'Custom Cafe Racer Black Gold', county: 'Nairobi', ownerName: 'Riders Clubs', categoryId: catMap['motorcycle-excellence'], plate: 'KMG 990B', make: 'Custom', model: 'Cafe Racer 250', voteCount: 7860, isFeatured: true },
    { name: 'Red Monster Sport Modified', county: 'Kiambu', ownerName: 'Alex Mutua', categoryId: catMap['motorcycle-excellence'], plate: 'KMF 441Z', make: 'Yamaha', model: 'FZ-25 Modified', voteCount: 6120, isFeatured: true },
    { name: 'Chrome Vintage Cruiser', county: 'Nakuru', ownerName: 'Samuel Njoroge', categoryId: catMap['motorcycle-excellence'], plate: 'KMD 331T', make: 'Royal Enfield', model: 'Classic 350', voteCount: 4890, isFeatured: false },

    // Riders Clubs
    { name: 'Nairobi Riders Safety Club', county: 'Nairobi', ownerName: 'Nairobi Boda Association', categoryId: catMap['riders-clubs'], plate: 'CLUB-NRB-01', make: 'Riders Fleet', model: 'Group Fleet', voteCount: 5320, isFeatured: true },
    { name: 'Coast Boda Boda Welfare Association', county: 'Mombasa', ownerName: 'Mombasa Boda Welfare', categoryId: catMap['riders-clubs'], plate: 'CLUB-MSA-02', make: 'Coast Fleet', model: 'Welfare Fleet', voteCount: 4150, isFeatured: true },
    { name: 'Rift Valley Rider Mentorship Club', county: 'Nakuru', ownerName: 'Rift Mentors', categoryId: catMap['riders-clubs'], plate: 'CLUB-NKR-03', make: 'Mentors Fleet', model: 'Mentorship Fleet', voteCount: 3290, isFeatured: false },

    // Industry Awards
    { name: 'Car & General Kenya', county: 'Nairobi', ownerName: 'Car & General Ltd', categoryId: catMap['industry-awards'], plate: 'IND-CG-01', make: 'TVS Distributor', model: 'Assembler', voteCount: 2980, isFeatured: true },
    { name: 'Bajaj Kenya Spareparts', county: 'Nairobi', ownerName: 'Bajaj Auto', categoryId: catMap['industry-awards'], plate: 'IND-BJ-02', make: 'Bajaj Spareparts', model: 'Service Center', voteCount: 2410, isFeatured: true },

    // Media Awards
    { name: 'BodaBoda Life Kenya YouTube', county: 'Nairobi', ownerName: 'BodaBoda Life', categoryId: catMap['media-awards'], plate: 'MED-YT-01', make: 'Media Production', model: 'Digital Creator', voteCount: 1780, isFeatured: true },
    { name: 'RideSafe Kenya Campaign', county: 'Kiambu', ownerName: 'RideSafe Org', categoryId: catMap['media-awards'], plate: 'MED-RS-02', make: 'Safety Campaign', model: 'Public Safety', voteCount: 1420, isFeatured: false },

    // Special Honours
    { name: 'Mzee Josephat Kiprono (40 Yrs Safe Riding)', county: 'Kericho', ownerName: 'Josephat Kiprono', categoryId: catMap['special-honours'], plate: 'HON-JK-01', make: 'Honda', model: 'Super Cub', voteCount: 170, isFeatured: true },
  ];

  for (const n of nomineesData) {
    const moto = await prisma.motorcycle.upsert({
      where: { registrationPlate: n.plate },
      update: {},
      create: { make: n.make, model: n.model, registrationPlate: n.plate },
    });

    const nomineeExist = await prisma.nominee.findFirst({
      where: { name: n.name, categoryId: n.categoryId },
    });

    if (!nomineeExist) {
      await prisma.nominee.create({
        data: {
          name: n.name,
          county: n.county,
          ownerName: n.ownerName,
          categoryId: n.categoryId,
          motorcycleId: moto.id,
          voteCount: n.voteCount,
          isFeatured: n.isFeatured,
          displayImageType: NomineeImageType.MOTORCYCLE_PHOTO,
        },
      });
    }
  }

  console.log('Seeding sample payment & vote log...');
  const sampleNominee = await prisma.nominee.findFirst();
  if (sampleNominee && sampleVoter) {
    const payment = await prisma.payment.create({
      data: {
        userId: sampleVoter.id,
        method: PaymentMethod.MPESA,
        amount: 100,
        currency: 'KES',
        status: PaymentStatus.SUCCESS,
        providerRef: 'PAYSTACK-TXN-24560',
      },
    });

    const vote = await prisma.vote.findUnique({ where: { paymentId: payment.id } });
    if (!vote) {
      await prisma.vote.create({
        data: {
          userId: sampleVoter.id,
          nomineeId: sampleNominee.id,
          paymentId: payment.id,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: 'SEED_INITIALIZED',
        entity: 'Database',
        metadata: JSON.stringify({ seeded: true, timestamp: new Date() }),
      },
    });
  }

  console.log('Seed completed successfully with real Boda Boda nominees!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
