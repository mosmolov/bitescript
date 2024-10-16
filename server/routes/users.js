import express from "express";
import { getUser, updateUser, followUser, unfollowUser, getUserFeed } from "../controllers/users.js";

const router = express.Router();

// TODO: add auth middleware

// User Information
router.get("/:id", getUser);
router.patch("/:id", updateUser);

// User Interaction
router.post("/:id/follow", followUser);
router.delete("/:id/follow", unfollowUser);

// Feed
router.get("/:id/feed", getUserFeed);

export default router;