import express from "express";
import {
  addCategories,
  addImage,
  addProduct,
  deleteProduct,
} from "../controller/product.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";
import { upload } from "../services/cloudinary";

const productRouter = express.Router();

productRouter.post("/add-img", jwtMiddleware, upload.single("image"), addImage);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.post("/delete-product/:id", jwtMiddleware, deleteProduct);
productRouter.post("/add-category", jwtMiddleware, addCategories);

export default productRouter;
