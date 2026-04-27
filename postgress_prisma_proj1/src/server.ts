import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import express, { type Request, type Response } from "express";
import postRouter from "./routes/post.routes";
import userRouter from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
// Routes

app.use("/api/post", postRouter);
app.use("/api/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
