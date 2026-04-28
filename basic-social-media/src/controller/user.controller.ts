import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// create user
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

// update user
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "User updated ", data: updatedUser });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while updating the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// fetch users
export const fetchUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const allUsers = await prisma.user.findMany();
    res
      .status(200)
      .json({ success: true, message: "Users fetched ", data: allUsers });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// get one user
export const showUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });
    res
      .status(200)
      .json({ success: true, message: "Users fetched ", data: user });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while getting the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;

    const deletedUser = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    res
      .status(200)
      .json({ success: true, message: "User deleted ", data: deletedUser });
  } catch (error: unknown) {
    const err = error as Error;
    console.log(`something went wrong while deleting the user`, err);
    res
      .status(500)
      .json({ success: false, message: "Server side error", error: err });
  }
};
