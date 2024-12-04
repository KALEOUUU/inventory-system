import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// item management (admin only)
export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, category, location, quantity } = req.body;

    const item = await prisma.item.create({
      data: {
        name,
        category,
        location,
        quantity
      }
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error
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

