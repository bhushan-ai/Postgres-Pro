import { Hono } from "hono";

import { jwtAuth } from "../../middleware/jwtAuth";
import {
  deleteMessage,
  editMessage,
  searchMessages,
  sendMessage,
} from "../../controller/chat.controller";

const chatRouter = new Hono();

chatRouter.post("/send", jwtAuth, sendMessage);
chatRouter.delete(
  "/delete-msg/:conversationId/:messageId",
  jwtAuth,
  deleteMessage,
);
chatRouter.put("/edit-msg/:conversationId/:messageId", jwtAuth, editMessage);
chatRouter.get("/search/:conversationId", jwtAuth, searchMessages);

export default chatRouter;
