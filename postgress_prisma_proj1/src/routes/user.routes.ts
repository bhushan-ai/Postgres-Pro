import express from "express";
import { createUser, getAllUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/create-user", createUser);
userRouter.get("/all-users", getAllUser);

export default userRouter;
