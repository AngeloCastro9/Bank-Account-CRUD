import { PrismaClient } from '@prisma/client';
import { bankAccountType } from './src/modules/bank-account/enums/bank-account-type.enum';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 12);

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      document: '123456789',
      phone: '1234567890',
    },
  });

  console.log(`User created: ${user.email}`);

  const bankAccount = await prisma.bankAccount.create({
    data: {
      bank: 'Test Bank',
      agency: '0001',
      account: '12345678',
      digit: '9',
      type: bankAccountType.CURRENT,
      balance: 1000.0,
      userId: user.id,
    },
  });

  console.log(`Bank account created: ${bankAccount.account}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
