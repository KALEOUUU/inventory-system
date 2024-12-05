import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Create new request
export const userCreateRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const { itemId, borrowDate, returnDate, quantity = 1 } = req.body;
    const userId = req.body.user?.id;

    if (userId <=0 ) {
      return res.status(400).json({
        success: false,
        message: "userId must be a positive number"
      });
    }

    // Validate required inputs
    if (!itemId || !borrowDate || !returnDate || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: itemId, borrowDate, returnDate, and userId are required"
      });
    }

    // Validate that the requesting user matches the authenticated user
    if (parseInt(userId) !== req.body.user?.id) {
      return res.status(403).json({
        success: false,
        message: "You can only create requests for your own user account"
      });
    }

    // Validate input types and positive values

    const parsedItemId = parseInt(itemId);
    
    if (isNaN(parsedItemId)) {
      return res.status(400).json({
        success: false,
        message: "itemId and userId must be valid numbers"
      });
    }

    // Validate dates
    const borrowDateTime = new Date(borrowDate);
    const returnDateTime = new Date(returnDate);
    const now = new Date();

    if (isNaN(borrowDateTime.getTime()) || isNaN(returnDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for borrowDate or returnDate"
      });
    }

    if (borrowDateTime < now) {
      return res.status(400).json({
        success: false,
        message: "Borrow date cannot be in the past"
      });
    }

    if (returnDateTime < borrowDateTime) {
      return res.status(400).json({
        success: false,
        message: "Return date cannot be before borrow date"
      });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer"
      });
    }

    // Check item availability
    const item = await prisma.item.findUnique({
      where: { id: parsedItemId }
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    // Check if quantity is available
    const activeRequests = await prisma.request.aggregate({
      where: {
        itemId: parsedItemId,
        status: 'BORROWED',
      },
      _sum: {
        quantity: true
      }
    });

    const totalBorrowed = activeRequests._sum.quantity || 0;
    const availableQuantity = item.quantity - totalBorrowed;

    if (quantity > availableQuantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity not available. Only ${availableQuantity} items available.`
      });
    }

    const request = await prisma.request.create({
      data: {
        userId: parseInt(userId),
        itemId: parsedItemId,
        borrowDate: borrowDateTime,
        returnDate: returnDateTime,
        status: 'PENDING',
        quantity: quantity
      },
      include: {
        item: true
   
      }
    });

    res.status(201).json({
      success: true,
      message: "Request successfully created",
      data: request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create request",
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

  
  // Update return date for borrowed item
  export const updateReturnDate = async (req: Request, res: Response): Promise<any> => {
    try {
      const { borrowId, returnDate, returnedQuantity } = req.body;

      // Get the current request
      const currentRequest = await prisma.request.findUnique({
        where: {
          borrowId: parseInt(borrowId)
        },
        include: {
          item: true
        }
      });

      if (!currentRequest) {
        return res.status(404).json({
          status: "error",
          message: "Request not found"
        });
      }

      // Validate returned quantity
      if (!returnedQuantity || returnedQuantity !== currentRequest.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Return quantity must match borrowed quantity of ${currentRequest.quantity}`
        });
      }

      const actualReturnDate = new Date(returnDate);
      const borrowDate = currentRequest.borrowDate;

      // Check if return date is before borrow date
      if (actualReturnDate < borrowDate) {
        return res.status(400).json({
          status: "error",
          message: "Return date cannot be earlier than borrow date"
        });
      }

      const isLate = actualReturnDate > currentRequest.returnDate;

      const request = await prisma.request.update({
        where: {
          borrowId: parseInt(borrowId)
        },
        data: {
          actualReturnDate: actualReturnDate,
          status: 'RETURNED'
        },
        include: {
          user:true,
          item: true
        }
      });

      res.status(200).json({
        status: "success", 
        message: isLate ? 
          "Pengembalian barang berhasil dicatat, namun terlambat dari jadwal" :
          "Pengembalian barang berhasil dicatat tepat waktu",
        data: {
          borrowId: request.borrowId,
          itemId: request.itemId.toString(),
          userId: request.userId.toString(),
          quantity: request.quantity,
          returnedQuantity: returnedQuantity,
          actual_return_date: request.actualReturnDate?.toISOString().split('T')[0] || null,
          scheduled_return_date: request.returnDate.toISOString().split('T')[0],
          isLate: isLate
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
  
  export const analyzeUsage = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startDate, endDate, group_by } = req.body

        if (!startDate || !endDate || !group_by) {
            return res.status(400).json({
                status: "error",
                message: "startDate, endDate, and group_by are required"
            })
        }

        // Validasi group_by
        if (!['category', 'location'].includes(group_by)) {
            return res.status(400).json({
                status: "error",
                message: "group_by must be either 'category' or 'location'"
            })
        }

        // Query untuk mendapatkan data analisis
        const usageData = await prisma.item.findMany({
            where: {
                requests: {
                    some: {
                        OR: [
                            {
                                borrowDate: {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate)
                                }
                            },
                            {
                                status: 'BORROWED'  // Tambahkan untuk mendapatkan item yang masih dipinjam
                            }
                        ]
                    }
                }
            },
            select: {
                [group_by]: true,
                requests: {
                    where: {
                        OR: [
                            {
                                borrowDate: {
                                    gte: new Date(startDate),
                                    lte: new Date(endDate)
                                }
                            },
                            {
                                status: 'BORROWED'  // Tambahkan untuk mendapatkan item yang masih dipinjam
                            }
                        ]
                    },
                    select: {
                        borrowId: true,
                        actualReturnDate: true,
                        status: true,
                        borrowDate: true,
                        returnDate: true
                    }
                }
            }
        })

        // Proses data untuk format yang diinginkan
        const groupedData = usageData.reduce((acc, item) => {
            const group = item[group_by] as string
            
            if (!acc[group]) {
                acc[group] = {
                    totalBorrowed: 0,
                    itemsInUse: 0,
                    returnedOnTime: 0,
                    returnedLate: 0
                }
            }

            const requests = item.requests
            acc[group].totalBorrowed += requests.length
            
            // Hitung items in use (yang sedang dipinjam)
            acc[group].itemsInUse = requests.filter(r => r.status === 'PENDING').length
            
            // Hitung yang sudah dikembalikan (tepat waktu atau terlambat)
            requests.forEach(r => {
                if (r.status === 'RETURNED' && r.actualReturnDate) {
                    if (new Date(r.actualReturnDate) > new Date(r.returnDate)) {
                        acc[group].returnedLate++
                    } else {
                        acc[group].returnedOnTime++
                    }
                }
            })

            return acc
        }, {} as Record<string, {
            totalBorrowed: number;
            itemsInUse: number;
            returnedOnTime: number;
            returnedLate: number;
        }>)

        // Format hasil akhir
        const usageAnalysis = Object.entries(groupedData).map(([group, stats]) => ({
            group,
            ...stats
        }))

        res.status(200).json({
            status: "Success",
            data: {
                analysis_period: {
                    startDate,
                    endDate
                },
                usageAnalysis
            }
        })
    } catch (error) {
        console.error('Analysis error:', error)
        res.status(500).json({
            status: "error",
            message: "Failed to analyze usage",
            error
        })
    }
}

export const analyzeItemEfficiency = async (req: Request, res: Response): Promise<any> => {
    try {
        const { startDate, endDate } = req.body

        // Validasi input
        if (!startDate || !endDate) {
            return res.status(400).json({
                status: "error",
                message: "startDate and endDate are required"
            })
        }

        // Convert string dates to Date objects
        const start = new Date(startDate)
        const end = new Date(endDate)

        // 1. Analisis barang yang sering dipinjam
        const frequentlyBorrowedItems = await prisma.item.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                _count: {
                    select: {
                        requests: {
                            where: {
                                borrowDate: {
                                    gte: start,
                                    lte: end
                                }
                            }
                        }
                    }
                }
            },
            where: {
                requests: {
                    some: {} // Only include items that have been borrowed at least once
                }
            },
            orderBy: {
                requests: {
                    _count: 'desc'
                }
            },
            take: 10 
        })

        // 2. Analisis barang yang tidak efisien (sering terlambat dikembalikan)
        const inefficientItems = await prisma.item.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                requests: {
                    where: {
                        borrowDate: {
                            gte: start,
                            lte: end
                        }
                    },
                    select: {
                        returnDate: true,
                        actualReturnDate: true,
                        status: true
                    }
                }
            }
        })

        // Proses data untuk format response
        const frequentlyBorrowedFormatted = frequentlyBorrowedItems
            .filter(item => item._count.requests > 0)
            .map(item => ({
                itemId: item.id,
                name: item.name,
                category: item.category,
                totalBorrowed: item._count.requests
            }))

        const inefficientItemsFormatted = inefficientItems.map(item => {
            const totalBorrowed = item.requests.length
            const totalLateReturns = item.requests.filter(req => {
                if (!req.actualReturnDate || req.status !== 'RETURNED') return false
                return new Date(req.actualReturnDate) > new Date(req.returnDate)
            }).length

            return {
                itemId: item.id,
                name: item.name,
                category: item.category,
                totalBorrowed,
                totalLateReturns,
                currentlyInUse: item.requests.filter(req => req.status === 'BORROWED').length
            }
        }).filter(item => item.totalLateReturns > 0) 
        .sort((a, b) => b.totalLateReturns - a.totalLateReturns)
        .slice(0, 10)

        res.status(200).json({
            status: "Success",
            data: {
                analysis_period: {
                    startDate,
                    endDate
                },
                frequently_borrowed_items: frequentlyBorrowedFormatted,
                inefficient_items: inefficientItemsFormatted
            }
        })

    } catch (error) {
        console.error('Analysis error:', error)
        res.status(500).json({
            status: "error",
            message: "Failed to analyze item efficiency",
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        })
    }
}