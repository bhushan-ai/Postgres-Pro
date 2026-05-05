import "dotenv/config";
import express, { type Request, type Response } from "express";


const app = express();

// Routes

app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
