import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import express, { type Request, type Response } from "express";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
// Routes
app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default app;
