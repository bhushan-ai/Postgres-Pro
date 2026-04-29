import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// fetch Comments
export const fetchComments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const allComments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    res.status(200).json({
      success: true,
      message: "Users all comments ",
      data: allComments,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the comments`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// create comment
export const createComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, post_id, comment } = req.body;

    // Increase comment count
    await prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    const newComment = await prisma.comment.create({
      data: {
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment: comment,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Commented", data: newComment });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while creating the comments`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// update comment
export const updateComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const commentId = req.params.id as string;
    const { comment } = req.body;

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment: comment,
      },
    });

    res.status(201).json({
      success: true,
      message: "comment updated ",
      data: updatedComment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while updating the comment`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// get one comment
export const showComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const commentId = req.params.id as string;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        post: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Comment fetched ", data: comment });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the comment`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// delete post
export const deleteComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { commentId, postId } = req.params;

    // Decrease comment count
    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        comment_count: {
          decrement: 1,
        },
      },
    });

    const deletedComment = await prisma.comment.delete({
      where: {
        id: String(commentId),
      },
    });

    res.status(200).json({
      success: true,
      message: "comment deleted ",
      data: deletedComment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while deleting the comment`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
