import express from "express";
import {
  getRestaurants,
  getNearbyRestaurants,
  getTopRatedRestaurants,
  filterRestaurants,
} from "../controllers/restaurantController.js";

const router = express.Router();

// Search restaurants
router.get("/search", getRestaurants);

// Get nearby restaurants
router.get("/nearby", getNearbyRestaurants);

// Get top rated restaurants
router.get("/top-rated", getTopRatedRestaurants);

// Filter restaurants
router.get("/filter", filterRestaurants);

export default router;
