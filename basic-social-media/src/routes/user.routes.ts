import express from "express";
import { createUser } from "../controller/user.controller";

const userRoutes = express.Router();

userRoutes.post("/create-user", createUser);

export default userRoutes;
