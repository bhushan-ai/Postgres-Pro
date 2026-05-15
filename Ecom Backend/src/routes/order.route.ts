import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import { addCustomerAddress, getOrderById, getOrders, order, orderStatusUpdateByAdmin } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/place-order", jwtMiddleware, order);
orderRouter.get("/user-orders", jwtMiddleware, getOrders);
orderRouter.get("/get-order/:id", jwtMiddleware, getOrderById);
orderRouter.patch("/update/:id/status", jwtMiddleware, orderStatusUpdateByAdmin);

orderRouter.post("/add-address", jwtMiddleware, addCustomerAddress);


export default orderRouter;
