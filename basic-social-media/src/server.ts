import "dotenv/config";
import cors from "cors";
import express, { type Request, type Response } from "express";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";

const app = express();

app.use(cors());
app.use(express.json());
// Routes

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.send("API's are working!!");
});

export default app;
