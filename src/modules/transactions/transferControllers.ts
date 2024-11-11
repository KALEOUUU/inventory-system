import { Request, Response } from "express";
import { transferBetweenAccounts } from "./transferService";

export async function transferHandler(
    req: Request,
    res: Response
) {
    const {
        senderAccountId,
        receiverAccountId,
        transferAmount
    } = req.body;
    try {
        const result = await transferBetweenAccounts(
            senderAccountId,
            receiverAccountId,
            transferAmount
        );
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
}