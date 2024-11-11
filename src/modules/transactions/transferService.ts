import prisma from "../../prisma/client";


export async function transferBetweenAccounts(
    senderAccountId: number,
    receiverAccountId: number,
    transferAmount: number
) {
    return await prisma.$transaction(
        async (prisma) => {
            //get saldo from sender account
            const senderAccount = await prisma.account.findUnique({
                where: { id: senderAccountId },
            });

            if (!senderAccount || senderAccount.balance < transferAmount) {
                throw new Error('Insufficient funds');
            }

            //get saldo from receiver account
            await prisma.account.update({
                where: { id: senderAccountId },
                data: {
                    balance: senderAccount.balance - transferAmount
                }
            });

            //add saldo to receiver account
            const receiverAccount = await prisma.account.findUnique({
                where: { id: receiverAccountId },
            });
            if (!receiverAccount){
                throw new Error('Receiver account not found');
            }

            await prisma.account.update({
                where: { id: receiverAccountId },
                data: {balance: receiverAccount.balance + transferAmount}
            })

            //note the transaction
            await prisma.transaction.createMany({
                data: [
                    {accountId: senderAccountId, amount: -transferAmount},
                    {accountId: receiverAccountId, amount: transferAmount},
                ],
            });
            return {meesagge: 'Transfer completed'};
        }
    )
}