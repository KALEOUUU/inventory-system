import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.create({
        data: {
            name: "Alice",
            email: "alice@example.com",
            accounts: {
                create: [
                    {
                        balance: 500.0, //akun pengirim
                    },
                ]
            }
        }
    });

    const user2 = await prisma.user.create({
        data: {
            name: "Bob",
            email: "bob@example.com",
            accounts: {
                create: [
                    {
                        balance: 300.0, //akun penerima
                    },
                ]
            }
        }
    });

    console.log("User 1:", user1);
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});