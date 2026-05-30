import { Hono } from "hono";
const userRouter = new Hono();

import {
  allUsers,
  createUser,
  deleteAllUser,
  login,
  logout,
  refresh,
  updateUser,
} from "../controller/user.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { Context } from "hono";

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.delete("/logout", logout);
// userRouter.delete("/deleteAll", deleteAllUser);
userRouter.get("/all-users", allUsers);

userRouter.put("/update-user", jwtAuth, updateUser);

userRouter.get("/protected", jwtAuth, async (c: Context) => {
  c.json({ message: "You are authenticated" }, 200);
});

export default userRouter;
