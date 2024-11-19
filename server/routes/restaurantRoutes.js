import express from "express";
import Restaurant from "../models/restaurant.js";
import {
  getRestaurants,
  getNearbyRestaurants,
  getTopRatedRestaurants,
  filterRestaurants,
  getRestaurant,
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

router.get("/:id", getRestaurant);

router.get('/:id/status', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const isOpen = restaurant.isCurrentlyOpen();
    res.json({ isOpen });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
