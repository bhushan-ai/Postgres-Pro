import express, { Request, Response } from "express";
import {
  login,
  logout,
  refresh,
  registerUser,
} from "../controllers/user.controller";
import { jwtMiddleware } from "../middleware/jwtmiddleware";

const userRouter = express.Router();

userRouter.post("/user-create", registerUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.delete("/logout", logout);

userRouter.get("/protected", jwtMiddleware, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated" });
});

export default userRouter;
