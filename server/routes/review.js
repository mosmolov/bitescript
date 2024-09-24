const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Review = require('../models/review');
app.use(bodyParser.json());
import { getReviewByID } from '../controllers/review';

// Routes

// Get all reviews for a restaurant
router.get('/restaurant/:id/reviews', getReviewByID);
  
  // Get one review for a restaurant
  app.get('/restaurant/:restaurantId/reviews/:reviewId', async (req, res) => {
    const review = await Review.findOne({
      restaurant_id: req.params.restaurantId,
      _id: req.params.reviewId,
    });
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  });
  
  // Post a review
  app.post('/restaurant/:id/reviews', async (req, res) => {
    const newReview = new Review({
      restaurant_id: req.params.id,
      user_id: req.body.user_id,
      overall_rating: req.body.overall_rating,
      food_rating: req.body.food_rating,
      service_rating: req.body.service_rating,
      review_text: req.body.review_text,
      amount_spent: req.body.amount_spent,
      photo_url: req.body.photo_url,
    });
    await newReview.save();
    res.status(201).json(newReview);
  });
  
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });