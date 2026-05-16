import express from "express";
import {
  addCategories,
  addImage,
  addProduct,
  deleteProduct,
  getAllCategories,
  getAllProducts,
  updateProduct,
} from "../controller/product.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";
import { upload } from "../services/cloudinary";

const productRouter = express.Router();

//public routes
productRouter.get("/all-products", getAllProducts);

//private routes
productRouter.post("/add-img", jwtMiddleware, upload.single("image"), addImage);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.delete("/delete-product/:id", jwtMiddleware, deleteProduct);
productRouter.put("/update-product/:productId", jwtMiddleware, updateProduct);
productRouter.post("/add-category", jwtMiddleware, addCategories);
productRouter.get("/categories", jwtMiddleware, getAllCategories);

export default productRouter;
