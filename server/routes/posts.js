import express from "express";
import { getPost, deletePost, likeOrUnlikePost, postComment, updateComment, deleteComment, getPosts, createPost, getUserPosts, getPostsForRestaurant} from "../controllers/posts.js";

const router = express.Router();

// Feed
router.get("/", getPosts); 
router.post("/", createPost); 
router.get("/user/:id", getUserPosts);
router.get("/restaurant/:id", getPostsForRestaurant);
//Post Logic
router.get("/:id",getPost); // include likes and comments
router.delete("/:id",deletePost);

//Interactions with posts
router.patch("/:id/likes", likeOrUnlikePost);
router.patch("/:id/comments", postComment);

//Comment functionality on posts
router.patch("/:id/comments",updateComment);
router.delete("/:id/comments",deleteComment);

export default router;