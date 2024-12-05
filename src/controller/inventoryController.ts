import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// item management (admin only)
export const createItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, category, location, quantity, description } = req.body;

    // Validate required fields
    if (!name || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and location are required"
      });
    }

    // Validate quantity
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number"
      });
    }

    // Check for duplicate item name using case-insensitive search
    const existingItem = await prisma.item.findFirst({
      where: {
        name: {
          equals: name.toLowerCase()
          
        }
      }
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item with this name already exists"
      });
    }

    const item = await prisma.item.create({
      data: {
        name: name.trim(), // Remove any leading/trailing whitespace
        category: category.trim(),
        location: location.trim(),
        quantity: parsedQuantity,
        description: description?.trim() || ""
      }
    });

    res.status(201).json({
      success: true,
      message: "Item successfully added",
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, category, location, quantity } = req.body;

    // Get existing item
    const existingItem = await prisma.item.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (category !== undefined) {
      updateData.category = category.trim(); 
    }
    if (location !== undefined) {
      updateData.location = location.trim();
    }
    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a non-negative number"
        });
      }
      updateData.quantity = parsedQuantity;
    }

    // Only update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    const item = await prisma.item.update({
      where: {
        id: parseInt(id)
      },
      data: updateData
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
export const deleteItem = async (req: Request, res: Response): Promise<any> => {
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

export const getAllItem = async (req: Request, res: Response): Promise<any> => {
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

