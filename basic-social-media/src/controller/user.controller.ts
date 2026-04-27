import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (findUser) {
      res.status(409).json({ success: false, message: "Email already Exist" });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "User Created", data: newUser });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while registering the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
