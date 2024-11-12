import express from "express";
import { getUser, updateUser, followUser, unfollowUser, getUserFeed } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// User Information
router.get("/:id", getUser);
router.patch("/:id", verifyToken, updateUser);

// User Interaction
router.post("/:id/follow", verifyToken, followUser);
router.delete("/:id/follow", verifyToken, unfollowUser);

// Feed
router.get("/:id/feed", getUserFeed);

export default router;