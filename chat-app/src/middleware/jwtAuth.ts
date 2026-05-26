import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
const secret = process.env.SECRET as string;

//auth
export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(400).json({ success: true, message: "token not found" });
    }

    const decodedToken = jwt.verify(token, secret) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong in user Authentication`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
