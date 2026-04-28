import express from "express";
import {
  createUser,
  deleteUser,
  fetchUsers,
  showUser,
  updateUser,
} from "../controller/user.controller";

const userRoutes = express.Router();

userRoutes.post("/create-user", createUser);
userRoutes.get("/users", fetchUsers);
userRoutes.get("/user/:id", showUser);
userRoutes.put("/update-user/:id", updateUser);
userRoutes.delete("/delete-user/:id", deleteUser);

export default userRoutes;
