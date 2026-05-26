import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
