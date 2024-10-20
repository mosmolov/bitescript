import Review from "../models/review.js";
import Restaurant from "../models/restaurant.js";

// get one Review by ID
export const getReviewByID = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.status(200).json(review);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// get all reviews for a restaurant
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant_id: req.params.id });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


export const createReview = async (req, res) => {
  const review = req.body;
  const newReview = new Review(review);
  try {
    await newReview.save();
    // update Restaurant model with new review
    await Restaurant.updateOne(newReview.restaurant_id, {
      $push: { ratings: newReview },
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
