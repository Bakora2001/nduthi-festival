import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking current database state ---');

  // 1. Find and delete "Fred bakora"
  const fredUsers = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: 'Fred', mode: 'insensitive' } },
        { lastName: { contains: 'Bakora', mode: 'insensitive' } },
        { firstName: { contains: 'Bakora', mode: 'insensitive' } },
      ],
    },
    include: { nominee: true, votes: true, payments: true },
  });

  console.log(`Found ${fredUsers.length} user matching Fred / Bakora:`, fredUsers.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, phone: u.phone, email: u.email })));

  const fredNominees = await prisma.nominee.findMany({
    where: {
      OR: [
        { name: { contains: 'Fred', mode: 'insensitive' } },
        { name: { contains: 'Bakora', mode: 'insensitive' } },
        { ownerName: { contains: 'Fred', mode: 'insensitive' } },
        { ownerName: { contains: 'Bakora', mode: 'insensitive' } },
      ],
    },
    include: { votes: true, user: true, motorcycle: true },
  });

  console.log(`Found ${fredNominees.length} nominee matching Fred / Bakora:`, fredNominees.map(n => ({ id: n.id, name: n.name, ownerName: n.ownerName })));

  // Delete Fred Nominees & relations
  for (const nom of fredNominees) {
    console.log(`Deleting nominee: ${nom.name} (${nom.id})`);
    await prisma.vote.deleteMany({ where: { nomineeId: nom.id } });
    await prisma.nominee.delete({ where: { id: nom.id } });
    if (nom.motorcycleId) {
      await prisma.motorcycle.delete({ where: { id: nom.motorcycleId } }).catch(() => {});
    }
  }

  // Delete Fred Users if they are not SUPER_ADMIN
  for (const u of fredUsers) {
    if (u.email === 'nduthifestivalkenya@gmail.com') {
      console.log('Skipping super admin account!');
      continue;
    }
    console.log(`Deleting user: ${u.firstName} ${u.lastName} (${u.id})`);
    await prisma.vote.deleteMany({ where: { userId: u.id } });
    await prisma.payment.deleteMany({ where: { userId: u.id } });
    await prisma.notification.deleteMany({ where: { userId: u.id } });
    await prisma.auditLog.deleteMany({ where: { userId: u.id } });
    await prisma.user.delete({ where: { id: u.id } });
  }

  // 2. Look up Categories to find Best Customized Nduthi (or 001 Kenya / Rider of the year)
  const categories = await prisma.category.findMany();
  console.log('Categories available:', categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

  // Find "Best customized nduthi" or "001 Kenya" or default
  const customizedCat = categories.find(c => c.name.toLowerCase().includes('customized')) ||
    categories.find(c => c.name.toLowerCase().includes('001')) ||
    categories[0];

  console.log(`Assigning Mejja to category: ${customizedCat?.name} (${customizedCat?.id})`);

  // 3. Create or Update "Its mejja"
  const nomineeRole = await prisma.role.upsert({
    where: { name: 'NOMINEE' },
    update: {},
    create: { name: 'NOMINEE' },
  });

  const passwordHash = await bcrypt.hash('12345678', 12);
  const mejjaPhone = '+254700000001'; // Default valid Kenyan phone for Its mejja (can be updated anytime)
  const mejjaEmail = 'itsmejja@nduthiawards.co.ke';

  let mejjaUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: mejjaPhone },
        { firstName: { contains: 'mejja', mode: 'insensitive' } },
        { lastName: { contains: 'mejja', mode: 'insensitive' } },
      ],
    },
  });

  if (!mejjaUser) {
    mejjaUser = await prisma.user.create({
      data: {
        firstName: 'Its',
        lastName: 'Mejja',
        phone: mejjaPhone,
        email: mejjaEmail,
        passwordHash,
        roleId: nomineeRole.id,
      },
    });
    console.log(`Created User for Its Mejja: ${mejjaUser.id}`);
  } else {
    mejjaUser = await prisma.user.update({
      where: { id: mejjaUser.id },
      data: {
        firstName: 'Its',
        lastName: 'Mejja',
        passwordHash,
      },
    });
    console.log(`Updated User for Its Mejja: ${mejjaUser.id}`);
  }

  // Create Motorcycle for Mejja
  const moto = await prisma.motorcycle.upsert({
    where: { registrationPlate: 'ELD-MEJJA-001' },
    update: {
      make: 'Custom Boxer',
      model: 'Mejja Edition Art Bike',
    },
    create: {
      make: 'Custom Boxer',
      model: 'Mejja Edition Art Bike',
      registrationPlate: 'ELD-MEJJA-001',
    },
  });

  // Check if Nominee exists for Mejja
  const existingMejjaNominee = await prisma.nominee.findFirst({
    where: {
      OR: [
        { userId: mejjaUser.id },
        { name: { contains: 'mejja', mode: 'insensitive' } },
      ],
    },
  });

  if (existingMejjaNominee) {
    const updated = await prisma.nominee.update({
      where: { id: existingMejjaNominee.id },
      data: {
        name: 'Its mejja',
        ownerName: 'Its mejja',
        county: 'Eldoret, Kenya',
        categoryId: customizedCat.id,
        motorcycleId: moto.id,
        imageUrl: '/nominees/its_mejja.jpg',
        isFeatured: true,
      },
    });
    console.log('Updated Mejja Nominee record:', updated);
  } else {
    const createdNominee = await prisma.nominee.create({
      data: {
        name: 'Its mejja',
        ownerName: 'Its mejja',
        county: 'Eldoret, Kenya',
        categoryId: customizedCat.id,
        motorcycleId: moto.id,
        userId: mejjaUser.id,
        imageUrl: '/nominees/its_mejja.jpg',
        voteCount: 0,
        isFeatured: true,
      },
    });
    console.log('Created Mejja Nominee record:', createdNominee);
  }

  console.log('--- Completed successfully ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
