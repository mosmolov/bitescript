import express from "express";
import { getUser, updateUser, getUserPosts, followUser, unfollowUser, getUserFollowers, getUserFollowing, getUserFeed } from "../controllers/users.js";

const router = express.Router();

// TODO: add auth middleware

// User Information

router.get("/:id", getUser);
router.patch("/:id", updateUser);

router.get("/:id/posts", getUserPosts);

// User Interaction

router.post("/:id/follow", followUser);
router.delete("/:id/follow", unfollowUser);
router.get("/:id/followers", getUserFollowers)
router.get("/:id/following", getUserFollowing);

// Feed

router.get("/:id/feed", getUserFeed);

export default router;