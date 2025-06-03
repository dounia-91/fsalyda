import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const companies = await prisma.company.findMany();
    console.log('Liste des companies:', companies);
  } catch (error) {
    console.error('Erreur lors de la requête Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
