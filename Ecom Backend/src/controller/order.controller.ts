import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const order = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cartId, quantity } = req.body;
    const userId = req.user.id;

    // getting the cart
    const getCart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!getCart) {
      res.status(400).json({ success: false, message: "There is no cart" });
      return;
    }

    const getCartItems = await prisma.cartItem.findMany({
      where: {
        cartId: getCart.id,
      },
      include: {
        product: true,
      },
    });

    //validate cart
    for (const item of getCartItems) {
      if (item.quantity > item.product.stock) {
        res.status(400).json({
          success: false,
          message: `${item.product} is out of stock`,
        });
        return;
      }
    }

    const totalPrice = getCartItems.reduce((total, item) => {
      const price = item.product.price;
      const discount = item.product.discount;

      const discountedPrice = price - (price * discount) / 1000;
      return total + discountedPrice * item.quantity;
    }, 0);

    //creating order
    const createOrder = await prisma.order.create({
      data: {
        total: totalPrice,
        userId: userId,
      },
    });
    
    //creating order items


  
    //   res
    //     .status(400)
    //     .json({ success: false, message: "order can not be placed" });
    //   return;
    // }
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding the address`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//
