import "dotenv/config";
import express, { Request, Response } from "express";
import userRouter from "./routes/user.route";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

app.use("/api/user", userRouter);

export default app;
