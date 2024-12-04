import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// item management (admin only)
export const createItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, category, location, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative"
      });
    }

    // Create the item first
    const item = await prisma.item.create({
      data: {
        name,
        category,
        location,
        quantity
      }
    });

    // Verify item was created successfully
    const createdItem = await prisma.item.findFirst({
      where: { id: item.id, name: item.name, category: item.category, location: item.location, quantity: item.quantity }
    });

    if (createdItem != item) {
      return res.status(400).json({
        success: false,
        message: "Failed to create item"
      });
    }
    
  } catch (error) {
    // Log the error for debugging
    console.error('Create item error:', error);
    
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category, location, quantity } = req.body;

    const item = await prisma.item.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name,
        description,
        category,
        location,
        quantity
      }
    });

    res.status(200).json({
      success: true,
      message: "Barang berhasil diubah",
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.item.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({
      success: true,
      message: "item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error
    });
  }
};

export const getAllItem = async (req: Request, res: Response) => {
  try {
    const facilities = await prisma.item.findMany();

    res.status(200).json({
      success: true,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get facilities",
      error
    });
  }
};

