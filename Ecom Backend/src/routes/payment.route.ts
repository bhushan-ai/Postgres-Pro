import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth.js";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-payment-order/:id",
  jwtMiddleware,
  createPaymentOrder,
);
paymentRouter.post("/verify-payment", jwtMiddleware, verifyPayment);

export default paymentRouter;
