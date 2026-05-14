import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const order = async (req: Request, res: Response): Promise<void> => {
  try {
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

    //get the cart items
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
          message: `${item.product.name} is out of stock`,
        });
        return;
      }
    }

    //Calculate Total
    const totalPrice = getCartItems.reduce((total, item) => {
      const price = item.product.price; //200
      const discount = item.product.discount; //20

      const discountedPrice = price - (price * discount) / 100; // 200 * 20 = 2000 /100 = 200 -20 = 180
      return total + discountedPrice * item.quantity; // 0 + 180 *  2 =  360
    }, 0);

    //creating order
    const createOrder = await prisma.order.create({
      data: {
        total: totalPrice,
        userId: userId,
      },
    });

    // transaction database safety wrapper
    await prisma.$transaction(async (tx) => {
      //creating order items
      const orderItem = await tx.orderItem.createMany({
        data: getCartItems.map((item) => ({
          orderId: createOrder.id as string,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      //stock reduction
      for (const item of getCartItems) {
        await tx.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      //delete cart items
      await tx.cartItem.deleteMany({
        where: {
          cartId: getCart.id,
        },
      });

      res.status(201).json({
        success: true,
        message: "order placed",
        orderId: createOrder.id,
      });
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding the address`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
