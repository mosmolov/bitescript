import express from "express";
import { getPost, deletePost, getPostLikes, getPostComments, likePost, unlikePost, postComment, updateComment, deleteComment, getPosts, createPost} from "../controllers/posts.js";

const router = express.Router();

// Feed
router.get("/", getPosts); 
router.post("/", createPost); 

//Post Logic
router.get("/:id",getPost);
router.delete("/:id",deletePost);
router.get("/:id", getPostComments);
router.get(":/id",getPostLikes);

//Interactions with posts
router.get("/:id/likes", likePost);
router.delete("/:id/likes", unlikePost);
router.get("/:id/comments", postComment);

//Comment functionality on posts
router.patch("/:id/comments",updateComment);
router.delete("/:id/comments",deleteComment);

export default router;