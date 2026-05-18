import express from "express";
import { jwtMiddleware } from "../middleware/jwtAuth.js";
import { addCustomerAddress, getOrderById, getOrders, order, } from "../controller/order.controller.js";
const orderRouter = express.Router();
orderRouter.post("/place-order", jwtMiddleware, order);
orderRouter.get("/user-orders", jwtMiddleware, getOrders);
orderRouter.get("/get-order/:id", jwtMiddleware, getOrderById);
orderRouter.post("/add-address", jwtMiddleware, addCustomerAddress);
export default orderRouter;
