import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ success: false, message: "all fields are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: "Email already Exist" });
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name: name, email: email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ success: true, message: "User Registered", data: newUser });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while registering the user`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "all fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(409).json({ success: false, message: "Email is Invalid" });
    }

    const checkPass = await bcrypt.compare(password, user?.password as string);

    if (!checkPass) {
      res.status(401).json({ success: false, message: "password incorrect" });
    }

    const accessToken = generateAccessToken(user?.id as number);
    const refreshToken = generateRefreshToken(user?.id as number);

    await prisma.session.create({
      data: {
        userId: user?.id as number,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      success: true,
      message: "User login Successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: user,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while login the user`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
