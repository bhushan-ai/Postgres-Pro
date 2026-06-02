import "dotenv/config";
import userRouter from "./routes/user.route";
import { Hono } from "hono";
import { logger } from "hono/logger";

import conversationRouter from "./routes/conversation.route";
import chatRouter from "./routes/chat/chat.route";
import { createServer } from "node:http";

const app = new Hono<{
  Variables: Variables;
}>();

//const server = createServer(app.fetch);

//middleware
app.use("*", logger());

// Routes
app.get("/", (c) => {
  return c.text("API's are working!!");
});

app.route("/api/user", userRouter);
app.route("/api/conversation", conversationRouter);
app.route("/api/chat", chatRouter);

export default app;
