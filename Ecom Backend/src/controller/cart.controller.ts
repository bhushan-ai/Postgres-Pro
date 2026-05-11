import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const productId = req.params.id;
  const { quantity } = req.body;
  try {
    if (!productId) {
      res.status(400).json({
        success: false,
        message: "productId required",
      });
      return;
    }

    //check product is available
    const productExistOrNot = await prisma.product.findUnique({
      where: {
        id: productId as string,
      },
    });

    if (!productExistOrNot) {
      res.status(409).json({ success: false, message: "product not found" });
      return;
    }

    //check cart is exist
    const cartExistOrNot = await prisma.cart.findUnique({
      where: {
        userId: req.user.id,
      },
    });

    //cart creation
    let cart = cartExistOrNot;
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user.id,
        },
      });
    }

    if (!cart) {
      res
        .status(404)
        .json({ success: false, message: "unable to create Cart" });
      return;
    }

    //check product already exist in cart or not
    const checkProductAlreadyExistInCart = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId as string,
      },
    });

    let cartItem;

    if (checkProductAlreadyExistInCart) {
      cartItem = await prisma.cartItem.update({
        where: {
          id: checkProductAlreadyExistInCart.id,
        },
        data: {
          quantity: checkProductAlreadyExistInCart.quantity + quantity,
        },
      });

      res.status(200).json({
        success: true,
        message: "Cart updated",
        data: cartItem,
      });
      return;
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId as string,
          quantity: quantity,
        },
      });

      if (!cartItem) {
        res
          .status(402)
          .json({ success: false, message: "unable to add Item into Cart" });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Item added into Cart",
        data: cartItem,
      });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding the item into cart`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
