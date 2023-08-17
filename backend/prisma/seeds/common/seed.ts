import { PrismaClient } from '@prisma/client';
import { accounts } from './index';

let prismaClient: PrismaClient;

export async function seedCommonSampleData(
  prisma: PrismaClient,
): Promise<void> {
  prismaClient = prisma;

  if ((await prismaClient.account.count()) === 0) {
    await seedAccount();
  }
}

async function seedAccount(): Promise<void> {
  await prismaClient.account.createMany({
    data: await Promise.all(
      accounts.map(async (account: any) => ({
        ...account,
      })),
    ),
  });
}
