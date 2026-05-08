import express, { Request, Response } from "express";
import { createUser, login, refresh } from "../controller/user.controller";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);

userRouter.get("/protected", async (req: Request, res: Response) => {
  res.json({ message: "You are authenticated" });
});
