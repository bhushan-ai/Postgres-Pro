import express from "express";
import { jwtMiddleware } from "../middleware/jwtAuth.js";
import { getOrderOfUsers, orderStatusUpdateByAdmin, } from "../controller/admin.controller.js";
const adminRouter = express.Router();
adminRouter.get("/users-order", jwtMiddleware, getOrderOfUsers);
adminRouter.patch("/update/:id/status", jwtMiddleware, orderStatusUpdateByAdmin);
export default adminRouter;
