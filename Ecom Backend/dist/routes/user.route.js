import express from "express";
import { allUsers, createUser, login, logout, refresh, updateUser, } from "../controller/user.controller.js";
import { jwtMiddleware } from "../middleware/jwtAuth.js";
const userRouter = express.Router();
userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.delete("/logout", jwtMiddleware, logout);
userRouter.get("/all-users", allUsers);
userRouter.put("/update-user/:id", jwtMiddleware, updateUser);
userRouter.get("/protected", jwtMiddleware, async (req, res) => {
    res.json({ message: "You are authenticated" });
});
export default userRouter;
