import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

//get orders  of all users
export const getOrdersForConfirm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user.id;

    //check user is available or not
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    // check user is admin or not
    if (user?.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "you are not an Admin" });
      return;
    }

    const allOrders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      message: "All user order fetched",
      data: allOrders,
    });
  } catch (error: any) {
    const err = error as Error;
    console.log(`Something went wrong while fetching orders of all users`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
