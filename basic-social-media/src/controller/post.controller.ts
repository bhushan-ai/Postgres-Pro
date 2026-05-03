import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// fetch post
export const fetchPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // pagination
    let page: number = Number(req.query.page) || 1;
    let limit: number = Number(req.query.limit) || 10;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0 || limit > 100) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const allPosts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // to get total post count
    const totalPostCount = await prisma.post.count();
    const totalPages = Math.ceil(totalPostCount / limit);

    res.status(200).json({
      success: true,
      message: "Users all Posts ",
      data: allPosts,
      meta: {
        totalPages,
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the posts`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// create post
export const createPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, title, description } = req.body;

    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title: title,
        description: description,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Post Created", data: newPost });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while creating the post`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// update post
export const updatePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const post_id = req.params.id;
    const { title, description } = req.body;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        title: title,
        description: description,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Post updated ", data: updatedPost });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while updating the post`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// get one post
export const showPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;

    const post = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
      include: {
        comments: {
          select: {
            id: true,
            comment: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Post fetched ", data: post });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the post`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// delete post
export const deletePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const postId = req.params.id;

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    res
      .status(200)
      .json({ success: true, message: "post deleted ", data: deletedPost });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while deleting the post`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// search post
export const searchPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query.q as string;
    const post = await prisma.post.findMany({
      where: {
        description: {
          search: query,
        },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "post deleted ", data: post });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while searching post the post`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
