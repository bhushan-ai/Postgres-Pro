import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/payment.controller";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment-order", jwtMiddleware, createPaymentOrder);
paymentRouter.post("/verify-payment", jwtMiddleware, verifyPayment);

export default paymentRouter;
