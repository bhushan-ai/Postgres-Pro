import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
};

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
