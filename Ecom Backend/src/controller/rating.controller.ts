import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const addCustomerReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { comment, rating, productId } = req.body;
    const userId = req.user.id;

    if (!comment || !rating || !productId || !userId) {
      res.status(400).json({
        success: false,
        message: "All info required",
      });
      return;
    }

    // check product exist or not
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        message: "Invalid rating",
      });
      return;
    }

    const review = await prisma.review.create({
      data: {
        comment: comment,
        rating: rating,
        product: {
          connect: { id: productId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Customer review Added",
      data: review,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding Customer review `, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

export const deleteCustomerReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const review = await prisma.review.delete({
      where: {
        userId: userId,
        id: reviewId as string,
      },
    });

    res.status(200).json({
      success: true,
      message: "Customer review deleted",
      data: review,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while deleting Customer review `, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

export const allReviewsCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user.id;

    const allReviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            name: true,
            description: true,
            image: true,
            price: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Customer reviews fetched",
      data: allReviews,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(
      `Something went wrong while getting all Customer reviews `,
      err,
    );

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
