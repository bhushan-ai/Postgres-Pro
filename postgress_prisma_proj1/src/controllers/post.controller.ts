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

export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
};

export const publishPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json(post);
};
export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json(post);
};
