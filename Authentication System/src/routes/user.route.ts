import { Router } from "express";
import { login, registerUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/user-create", registerUser);
userRouter.post("/login", login);

export default userRouter;
