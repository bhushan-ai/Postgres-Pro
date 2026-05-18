import express from "express";
import { jwtMiddleware } from "../middleware/jwtAuth";
import { addCustomerReview, allReviewsCustomer, deleteCustomerReview, } from "../controller/rating.controller";
const reviewRouter = express.Router();
reviewRouter.post("/add-review", jwtMiddleware, addCustomerReview);
reviewRouter.delete("/delete-review/:id", jwtMiddleware, deleteCustomerReview);
reviewRouter.get("/reviews", jwtMiddleware, allReviewsCustomer);
export default reviewRouter;
