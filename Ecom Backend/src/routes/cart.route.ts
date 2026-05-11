import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth";
import { addToCart } from "../controller/cart.controller";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart/:id", jwtMiddleware, addToCart);

export default cartRouter;
