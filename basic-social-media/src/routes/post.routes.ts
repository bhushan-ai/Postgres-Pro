import express from "express";
import {
  createPost,
  deletePost,
  fetchPosts,
  showPost,
  updatePost,
} from "../controller/post.controller";

const postRoutes = express.Router();

postRoutes.post("/create-post", createPost);
postRoutes.get("/posts", fetchPosts);
postRoutes.get("/post/:id", showPost);
postRoutes.put("/update-post/:id", updatePost);
postRoutes.delete("/delete-post/:id", deletePost);

export default postRoutes;
