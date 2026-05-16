import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

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
  const { name, email, password, address, role } = req.body;
  try {
    if (!name || !email || !password || !address) {
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
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
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
      res.status(409).json({ success: false, message: "Email is Invalid" });
      return;
    }
    const checkPass = await bcrypt.compare(password, user?.password as string);

    if (!checkPass) {
      res.status(401).json({ success: false, message: "password incorrect" });
      return;
    }

    const accessToken = generateAccessToken(user?.id as string);
    const refreshToken = generateRefreshToken(user?.id as string);

    const alreadyLoggedIn = await prisma.session.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (alreadyLoggedIn) {
      res.status(401).json({ success: false, message: "already loggedIn" });
      return;
    } else {
      await prisma.session.create({
        data: {
          userId: user?.id as string,
          refreshToken: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    res.status(200).json({
      succuss: true,
      message: "LoggedIn Successfully",
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

//refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res
        .status(401)
        .json({ success: false, message: "Refresh token not found" });
      return;
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
    } catch (error) {
      res.status(403).json({ success: false, message: "Invalid Token" });
    }

    const session = await prisma.session.findUnique({
      where: {
        refreshToken: refreshToken,
      },
    });

    if (!session || session.expiresAt < new Date()) {
      res.status(403).json({ success: false, message: "session expired" });
    }

    const accessToken = generateAccessToken(session?.userId as string);
    res
      .status(200)
      .json({ success: true, message: "Refreshed", accessToken: accessToken });
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
    const { name, email, password, address } = req.body;

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
        ...(address && { name }),
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
    if (!req.user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const userId = req.user?.id;

    await prisma.session.deleteMany({
      where: {
        userId: userId as string,
      },
    });

    // const refreshToken = req.params.id;

    // await prisma.session.delete({
    //   where: { refreshToken: refreshToken as string },
    // });

    res.status(200).json({ success: true, message: "logged Out successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`Something went wrong while logging out`, err);

    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
