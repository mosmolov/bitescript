import express from "express";
import { getUser, updateUser, followUser, unfollowUser, getUserFeed } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// User Information
router.get("/:id", getUser);
router.patch("/:id", updateUser);

// User Interaction
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

// Feed
router.get("/:id/feed", getUserFeed);

export default router;