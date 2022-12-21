import { PrismaClient } from '@prisma/client';
import { links } from '../data/links';

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.user.create({
    data: {
      email: 'testemail@gmail.com',
      role: 'ADMIN',
    },
  });

  await prisma.link.createMany({
    data: links,
  });
};

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
