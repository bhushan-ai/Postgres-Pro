import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const posts = await prisma.post.findMany();
  res.json(posts);
};

export const feedPost = async (req: Request, res: Response): Promise<void> => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json(posts);
};

export const getPostById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const posts = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json(posts);
};
