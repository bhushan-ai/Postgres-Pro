import express from "express";
import {
  createComment,
  deleteComment,
  fetchComments,
  showComment,
  updateComment,
} from "../controller/comment.controller";

const CommentRoutes = express.Router();

CommentRoutes.post("/create-comment", createComment);
CommentRoutes.get("/comments", fetchComments);
CommentRoutes.get("/comment/:id", showComment);
CommentRoutes.put("/update-comment/:id", updateComment);
CommentRoutes.delete("/delete-comment/:postId", deleteComment);
//  CommentRoutes.delete("/delete-comment/:postId/:commentId", deleteComment);

export default CommentRoutes;
