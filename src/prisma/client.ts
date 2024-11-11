import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBalance() {
  const updatedAccount = await prisma.account.update({
    where: { id: 1 }, // Ganti dengan senderAccountId Anda
    data: { balance: 1000.0 }, // Ganti dengan jumlah yang diinginkan
  });

  console.log('Updated Sender Account:', updatedAccount);
}

updateBalance()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });


export default prisma