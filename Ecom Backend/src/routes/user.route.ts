import express, { Request, Response } from "express";
import {
  createUser,
  login,
  logout,
  refresh,
} from "../controller/user.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.delete("/logout/:id", logout);

userRouter.get(
  "/protected",
  jwtMiddleware,
  async (req: Request, res: Response) => {
    res.json({ message: "You are authenticated" });
  },
);

export default userRouter;
