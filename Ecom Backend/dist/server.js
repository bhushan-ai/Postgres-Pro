import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import reviewRouter from "./routes/rating.route";
import orderRouter from "./routes/order.route";
import adminRouter from "./routes/admin.route";
import paymentRouter from "./routes/payment.route";
const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/review", reviewRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);
app.get("/", (req, res) => {
    return res.send("API's are working!!");
});
export default app;
