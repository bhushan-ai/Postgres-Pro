import express from "express";
import {
  addCategories,
  addImage,
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controller/product.controller";
import { jwtMiddleware } from "../middleware/jwtAuth";
import { upload } from "../services/cloudinary";

const productRouter = express.Router();

//public routes
productRouter.get("/all-products", getAllProducts);

productRouter.post("/add-img", jwtMiddleware, upload.single("image"), addImage);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.delete("/delete-product/:id", jwtMiddleware, deleteProduct);
productRouter.put("/update-product/:id", jwtMiddleware, updateProduct);
productRouter.post("/add-category", jwtMiddleware, addCategories);

export default productRouter;
