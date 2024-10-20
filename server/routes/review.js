import express from "express";
import {
  getReviewByID,
  getRestaurantReviews,
  createReview,
} from "../controllers/review";
const router = express.Router();
// Routes

// Get all reviews for a restaurant
router.get("/restaurant/:id/reviews", getRestaurantReviews);

// Get one review for a restaurant
router.get("/restaurant/reviews/:reviewId", getReviewByID);

// Post a review
router.post("/restaurant/reviews", createReview);

export default router;
