import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

//get all users
export const allUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Users fetched", data: users });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while fetching the users`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//create
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      res.status(400).json({
        success: "false",
        message: "All Fields are required",
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: "Email already Exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "User Registered", data: newUser });

    // await resend.emails
    //   .send({
    //     from: process.env.EMAIL_USER!,
    //     to: newUser.email,
    //     subject: `Welcome to FitCheck ${newUser.name}`,
    //     html: welcomeEmail,
    //   })
    //   .catch((err) => {
    //     console.error("Mail error:", err);
    //   });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while registering the user`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//login
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
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const checkPass = await bcrypt.compare(password, user.password);

    if (!checkPass) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const accessToken = generateAccessToken(user.id as string);
    const refreshToken = generateRefreshToken(user.id as string);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: "LoggedIn Successfully",
      data: safeUser,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while login the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "Refresh token not found" });
      return;
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as {
        id: string;
      };
    } catch (error) {
      res.status(403).json({ success: false, message: "Invalid Token" });
      return;
    }
    const accessToken = generateAccessToken(payload.id);
    const newRefreshToken = generateRefreshToken(payload.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Refreshed",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while refreshing`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//update
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const userId = req.user?.id;

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
      },
    });

    res
      .status(201)
      .json({ success: true, message: "user updated", data: user });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while updating user`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

//logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, message: "logged Out successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while logging out`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
