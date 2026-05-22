import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import reviewRouter from "./routes/rating.route.js";
import orderRouter from "./routes/order.route.js";
import adminRouter from "./routes/admin.route.js";
import paymentRouter from "./routes/payment.route.js";
import { resend } from "./services/mail.js";

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

app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
