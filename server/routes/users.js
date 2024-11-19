import express from "express";
import { getUser, updateUser, followUser, unfollowUser, getUserFeed, searchUsers } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Search route must come before param routes
router.get("/search", searchUsers);

// Routes with parameters
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:id/feed", getUserFeed);

export default router;