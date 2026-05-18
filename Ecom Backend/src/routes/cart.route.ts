import express from "express";

import { jwtMiddleware } from "../middleware/jwtAuth.js";
import { addToCart, getCartItems } from "../controller/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart/:id", jwtMiddleware, addToCart);
cartRouter.get("/cart-items", jwtMiddleware, getCartItems);

export default cartRouter;
