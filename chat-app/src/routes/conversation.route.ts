import { Hono } from "hono";
import { jwtAuth } from "../middleware/jwtAuth";
import {
  createConversation,
  getSingleConversation,
  getUserConversations,
} from "../controller/conversation.controller";
const conversationRouter = new Hono();

conversationRouter.post("/create-convo", jwtAuth, createConversation);
conversationRouter.get("/get-convos", jwtAuth, getUserConversations);
conversationRouter.get("/get-one-convo/:id", jwtAuth, getSingleConversation);

export default conversationRouter;
