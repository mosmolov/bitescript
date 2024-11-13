import express from "express";
import { getPost, deletePost, likeOrUnlikePost, postComment, updateComment, deleteComment, getPosts, createPost} from "../controllers/posts.js";

const router = express.Router();

// Feed
router.get("/", getPosts); 
router.post("/", createPost); 

//Post Logic
router.get("/:id",getPost); // include likes and comments
router.delete("/:id",deletePost);

//Interactions with posts
router.post("/:id/likes", likeOrUnlikePost);
router.post("/:id/comments", postComment);

//Comment functionality on posts
router.patch("/:id/comments",updateComment);
router.delete("/:id/comments",deleteComment);

export default router;