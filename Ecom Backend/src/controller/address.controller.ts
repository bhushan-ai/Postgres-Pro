import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const addCustomerAddress = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      country,
      pinCode,
      userId,
    } = req.body;

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


