import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { razorpay } from "../lib/razorpay";
import crypto from "crypto";

//get user orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const allOrders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (allOrders.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "nothing is ordered yet" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "all orders", data: allOrders });
  } catch (error: any) {
    const err = error as Error;
    console.log(`Something went wrong while fetching orders of user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// get order by id
export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: id as string,
        userId: userId,
      },
    });

    if (!order) {
      res.status(400).json({ success: false, message: "order not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Order fetched", data: order });
  } catch (error: any) {
    const err = error as Error;
    console.log(`Something went wrong while fetching order by id`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// adding the customer address
export const addCustomerAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user.id;

    const { fullName, phone, addressLine, city, state, country, pinCode } =
      req.body;

    if (
      !fullName ||
      !phone ||
      !addressLine ||
      !city ||
      !state ||
      !country ||
      !pinCode ||
      !userId
    ) {
      res.status(400).json({
        success: false,
        message: "All info required",
      });
      return;
    }

    const address = await prisma.address.create({
      data: {
        fullName: fullName,
        phone: phone,
        addressLine: addressLine,
        state: state,
        country: country,
        city: city,
        pinCode: pinCode,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Address Added",
      data: address,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while adding the address`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// place order
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

      //creating payment record
      await prisma.payment.create({
        data: {
          orderId: createOrder.id,
          amount: totalPrice,
          paymentMethod: "Razorpay",
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

//create payment order in razorpay
export const createPaymentOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orderId = req.params.id;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId as string,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: "there is no  order" });
      return;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: (order?.total as number) * 100,
      currency: "INR",
      receipt: order?.id,
    });

    res.status(201).json({
      success: true,
      message: "razorpay order id created",
      data: razorpayOrder,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while creating payment order`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// verify the payment
export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      res.status(400).json({
        success: false,
        message: "Invalid payment",
      });

      return;
    }

    await prisma.payment.updateMany({
      where: {
        razorpayOrderId: razorpay_order_id as string,
      },
      data: {
        paymentStatus: "SUCCESS",
      },
    });
    res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while verification of payment`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
