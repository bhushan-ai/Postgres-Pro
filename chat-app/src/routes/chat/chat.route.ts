import { Hono } from "hono";  

import { jwtAuth } from "../../middleware/jwtAuth";
import {
  deleteMessage,
  editMessage,
  sendMessage,
} from "../../controller/chat.controller";

const chatRouter = new Hono();

chatRouter.post("/send", jwtAuth, sendMessage);
chatRouter.delete("/delete-msg/:conversationId/:messageId", jwtAuth, deleteMessage);
chatRouter.put("/edit-msg/:conversationId/:messageId", jwtAuth, editMessage);

export default chatRouter;
