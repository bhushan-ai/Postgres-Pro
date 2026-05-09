import express from "express";
import { addImage, addProduct } from "../controller/product.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";

const productRouter = express.Router();

productRouter.post("/add-img", jwtMiddleware, addImage);
productRouter.post("/add-product", jwtMiddleware, addProduct);

export default productRouter;
