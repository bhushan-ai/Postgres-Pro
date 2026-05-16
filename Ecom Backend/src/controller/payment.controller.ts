import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { razorpay } from "../lib/razorpay";
import crypto from "crypto";

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
