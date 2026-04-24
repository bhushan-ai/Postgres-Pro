import express from "express";
import {
  feedPost,
  getAllPost,
  getPostById,
} from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.get("/posts", getAllPost);
postRouter.get("/feed", feedPost);
postRouter.get("/post/:id", getPostById);

export default postRouter;
