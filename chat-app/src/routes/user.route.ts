import { Hono } from "hono";
const userRouter = new Hono();

import {
  allUsers,
  createUser,
  login,
  logout,
  refresh,
  updateUser,
} from "../controller/user.controller.js";
import { jwtAuth } from "../middleware/jwtAuth.js";

// const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refresh);
userRouter.delete("/logout", jwtAuth, logout);
userRouter.get("/all-users", allUsers);

userRouter.put("/update-user/:id", jwtAuth, updateUser);

// userRouter.get("/protected", jwtAuth, async (req: Request, res: Response) => {
//   res.json({ message: "You are authenticated" });
// });

export default userRouter;
