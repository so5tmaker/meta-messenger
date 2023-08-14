import { PrismaClient } from '@prisma/client';

import { seedCommonSampleData } from './seeds';

export const prismaClient = new PrismaClient();

async function seedSampleData(): Promise<void> {
  await seedCommonSampleData(prismaClient);
}

seedSampleData().finally(async () => {
  await prismaClient.$disconnect();
});
