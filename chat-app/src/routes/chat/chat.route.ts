import { Hono } from "hono";
import { Context } from "hono";

import { jwtAuth } from "../../middleware/jwtAuth";
import {
  deleteMessage,
  editMessage,
  getUrl,
  searchMessages,
  sendMessage,
} from "../../controller/chat.controller";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../services/aws/s3";

const chatRouter = new Hono();

chatRouter.post("/send", jwtAuth, sendMessage);
chatRouter.post("/send-msg-group/:conversationId", jwtAuth, sendMessage);
chatRouter.post("/get-url", jwtAuth, getUrl);

// chatRouter.post("/get-og-url", async (c: Context) => {
//   try {
//     const { key } = await c.req.json();

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: key,
//     });

//     const url = await getSignedUrl(s3Client, command, {
//       expiresIn: 3600,
//     });

//     return c.json({
//       url: url,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });




chatRouter.delete(
  "/delete-msg/:conversationId/:messageId",
  jwtAuth,
  deleteMessage,
);

chatRouter.put("/edit-msg/:conversationId/:messageId", jwtAuth, editMessage);
chatRouter.get("/search/:conversationId", jwtAuth, searchMessages);



//chat Router.delete("/deleteAll", jwtAuth, deleteAllMessage);

export default chatRouter;
