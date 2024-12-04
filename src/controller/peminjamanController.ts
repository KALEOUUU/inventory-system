import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Create new request
export const userCreateRequest = async (req: Request, res: Response) => {
    try {
      const { userId, itemId, borrowDate, returnDate } = req.body;
  
      const request = await prisma.request.create({
        data: {
          userId,
          itemId, 
          borrowDate: new Date(borrowDate),
          returnDate: new Date(returnDate),
        }
      });
  
      res.status(201).json({
        success: true,
        message: "Peminjaman berhasil dicatat",
        data: {
          borrowId: request.borrowId,
          itemId: request.itemId.toString(),
          userId: request.userId.toString(),
          borrowDate: request.borrowDate.toISOString().split('T')[0]
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create request",
        error
      });
    }
  };
  
  // Get all requests
  export const userGetAllRequest = async (req: Request, res: Response) => {
    try {
      const requests = await prisma.request.findMany({
        include: {
          user: true,
          item: true
        }
      });
  
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get requests",
        error
      });
    }
  };
  
  // Update return date for borrowed item
  export const updateReturnDate = async (req: Request, res: Response) => {
    try {
      const { borrowId, returnDate } = req.body;

      const request = await prisma.request.update({
        where: {
          borrowId: parseInt(borrowId)
        },
        data: {
          returnDate: new Date(returnDate)
        },
        include: {
          user: true,
          item: true
        }
      });

      res.status(200).json({
        status: "success", 
        message: "pengembalian barang berhasil dicatat",
        data: {
          borrowId: request.borrowId,
          itemId: request.itemId.toString(),
          userId: request.userId.toString(),
          actual_return_date: request.returnDate.toISOString().split('T')[0]
        }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to update return date",
        error
      });
    }
  };
  
  // Delete request
  export const userDeleteRequest = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      await prisma.request.delete({
        where: {
          borrowId: parseInt(id)
        }
      });
  
      res.status(200).json({
        success: true,
        message: "Request deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete request",
        error
      });
    }
  };
  
  // Get user requests
  export const getUserRequests = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const requests = await prisma.request.findMany({
        where: {
          userId: parseInt(userId)
        },
        include: {
          item: true
        }
      });
  
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get user requests",
        error
      });
    }
  };
  
  