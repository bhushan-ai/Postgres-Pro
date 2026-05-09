import express from "express";
import {
  addCategories,
  addImage,
  addProduct,
} from "../controller/product.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";
import { upload } from "../services/cloudinary";

const productRouter = express.Router();

productRouter.post("/add-img", jwtMiddleware, upload.single("image"), addImage);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.post("/add-category", jwtMiddleware, addCategories);

export default productRouter;
