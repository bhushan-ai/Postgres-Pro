import { Hono } from "hono";

import { jwtAuth } from "../../middleware/jwtAuth";
import {
  deleteMessage,
  editMessage,
  searchMessages,
  sendMessage,
  upload,
} from "../../controller/chat.controller";

const chatRouter = new Hono();

chatRouter.post("/send", jwtAuth, sendMessage);
chatRouter.post("/send-msg-group/:conversationId", jwtAuth, sendMessage);
chatRouter.post("/upload-file", jwtAuth, upload);
// chatRouter.delete("/deleteAll", jwtAuth, deleteAllMessage);

chatRouter.delete(
  "/delete-msg/:conversationId/:messageId",
  jwtAuth,
  deleteMessage,
);

chatRouter.put("/edit-msg/:conversationId/:messageId", jwtAuth, editMessage);
chatRouter.get("/search/:conversationId", jwtAuth, searchMessages);

export default chatRouter;
