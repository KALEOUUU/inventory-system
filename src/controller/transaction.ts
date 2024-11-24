  import { Request, Response } from "express";
  import { PrismaClient } from "@prisma/client";

  const prisma = new PrismaClient({ errorFormat: "pretty" });

  // Correct type definition for FinancialRecord
  type FinancialRecord = {
    id: number;
    amount: number;
    type: "INCOME" | "EXPENSE"; // Explicit type for transaction (string literal)
    description: string;
    createdAt: string;
  };

  const addFinancialRecord = async (req: Request, res: Response): Promise<any> => {
    try {
      const { amount, type, description, createdAt } = req.body;

      // Validate required fields
      if (!amount || !type || !description || !createdAt) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Ensure that type is in uppercase as defined in the Prisma schema
      const transactionType = type.toUpperCase() as "INCOME" | "EXPENSE";

      // Create a new financial record
      const newRecord = await prisma.transaction.create({
        data: {
          amount,
          description,
          type: transactionType, // Use the correct enum value
          createdAt: new Date(createdAt), // Convert string to Date
        },
      });

      return res.status(201).json({ message: "Financial record added successfully", data: newRecord });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding financial record", error });
    }
  };

  const getAllFinancialRecords = async (req: Request, res: Response): Promise<any> => {
    try {
      // Tambahkan log untuk debug
      console.log("Fetching records from database...");
      
      const records = await prisma.transaction.findMany({
        orderBy: { createdAt: "asc" },
      });
      
      // Log jumlah records yang ditemukan
      console.log("Found records:", records.length);
  
      return res.status(200).json({ message: "All financial records fetched", data: records });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Error fetching records", error });
    }
  };

  const updateFinancialRecord = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);
      const { amount, type, description, createdAt }: FinancialRecord = req.body;

      // Find the financial record to update
      const existingRecord = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        return res.status(404).json({ message: "Financial record not found" });
      }

      // Ensure the updated type is in uppercase
      const updatedType = type ? type.toUpperCase() as "INCOME" | "EXPENSE" : existingRecord.type;

      // Update the record
      const updatedRecord = await prisma.transaction.update({
        where: { id },
        data: {
          amount: amount || existingRecord.amount,
          type: updatedType,
          description: description || existingRecord.description,
          createdAt: createdAt ? new Date(createdAt) : existingRecord.createdAt, // Convert string to Date
        },
      });

      return res.status(200).json({ message: "Financial record updated successfully", data: updatedRecord });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating financial record", error });
    }
  };

  const getTotalByType = async (req: Request, res: Response): Promise<any> => {
    try {
      const { type } = req.query;

      // Validate the 'type' query parameter (ensure it matches INCOME or EXPENSE)
      if (!type || !['INCOME', 'EXPENSE'].includes(type as string)) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }

      // Calculate the total amount by transaction type (INCOME or EXPENSE)
      const total = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          type: type as "INCOME" | "EXPENSE", // Ensure correct enum type
        },
      });

      return res.status(200).json({ message: `Total amount`, total: total._sum.amount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error calculating total", error });
    }
  };

  // New endpoint to delete a financial record
  const deleteFinancialRecord = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = Number(req.params.id);

      // Find the financial record to delete
      const recordToDelete = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!recordToDelete) {
        return res.status(404).json({ message: "Financial record not found" });
      }

      // Delete the record
      await prisma.transaction.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Financial record deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting financial record", error });
    }
  };

  export { addFinancialRecord, getAllFinancialRecords, updateFinancialRecord, getTotalByType, deleteFinancialRecord };
