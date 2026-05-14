import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import { order } from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/order", jwtMiddleware, order);

export default orderRouter;
