import "dotenv/config";
import express, { Request, Response } from "express";
import userRouter from "./routes/user.route";

const app = express();

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

app.get("/api/user", userRouter);

export default app;
