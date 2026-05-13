import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import { addCustomerReview } from "../controller/review.controller";

const reviewRouter = express.Router();

reviewRouter.post("/add-review", jwtMiddleware, addCustomerReview);

export default reviewRouter;
