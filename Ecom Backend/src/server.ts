import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import reviewRouter from "./routes/rating.route";
import orderRouter from "./routes/order.route";

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

app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
