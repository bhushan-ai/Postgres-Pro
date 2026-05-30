import { Hono } from "hono";
import { jwtAuth } from "../middleware/jwtAuth";
import {
  createConversation,
  getUserConversations,
} from "../controller/conversation.controller";
const conversationRouter = new Hono();

conversationRouter.post("/create-convo", jwtAuth, createConversation);
conversationRouter.get("/get-convos", jwtAuth, getUserConversations);

export default conversationRouter;
