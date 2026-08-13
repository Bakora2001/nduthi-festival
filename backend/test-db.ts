import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing Prisma DB connection to Render PostgreSQL...');
  try {
    const rolesCount = await prisma.role.count();
    console.log('Successfully connected! Roles count:', rolesCount);
  } catch (err: any) {
    console.error('Connection error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
