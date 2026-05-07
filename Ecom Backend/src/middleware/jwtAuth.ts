import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
const accessSecret = process.env.ACCESS_SECRET as string;

export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, accessSecret) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    (req as any).user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error });
  }
};
