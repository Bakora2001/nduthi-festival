import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Updating Mejja phone number ---');

  const mejjaUser = await prisma.user.findFirst({
    where: {
      OR: [
        { firstName: { contains: 'mejja', mode: 'insensitive' } },
        { lastName: { contains: 'mejja', mode: 'insensitive' } },
        { email: { contains: 'mejja', mode: 'insensitive' } },
      ],
    },
    include: { nominee: true },
  });

  if (!mejjaUser) {
    console.error('Mejja user not found in database!');
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: mejjaUser.id },
    data: {
      phone: '+254718326404',
      email: '254718326404@nduthiawards.co.ke',
    },
  });

  console.log('Successfully updated Mejja user phone:', {
    id: updatedUser.id,
    name: `${updatedUser.firstName} ${updatedUser.lastName}`,
    phone: updatedUser.phone,
    email: updatedUser.email,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
