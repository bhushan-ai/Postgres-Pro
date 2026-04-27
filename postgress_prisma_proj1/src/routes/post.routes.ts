import express from "express";
import {
  createPost,
  deletePost,
  feedPost,
  getAllPost,
  getPostById,
  publishPost,
} from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.get("/posts", getAllPost);
postRouter.get("/feed", feedPost);
postRouter.get("/post/:id", getPostById);
postRouter.post("/create-posts", createPost);
postRouter.put("/publish-post/:id", publishPost);
postRouter.delete("/delete-post/:id", deletePost);

export default postRouter;
