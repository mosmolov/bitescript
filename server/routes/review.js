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
      price_spent: req.body.price_spent,
      photo_url: req.body.photo_url,
    });
    await newReview.save();
    res.status(201).json(newReview);
  });
  
  // like a review
  router.put('/reviews/:reviewId/like', async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.body.user_id;
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      if (!review.likes.includes(userId)) {
        review.likes.push(userId);
        await review.save();
        return res.status(200).json({ message: 'Review liked', review });
      } else {
        return res.status(400).json({ message: 'User already liked this review' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error liking review', error });
    }
  });
  
  // Unlike a review
  router.put('/reviews/:reviewId/unlike', async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.body.user_id;
  
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      const index = review.likes.indexOf(userId);
      if (index !== -1) {
        review.likes.splice(index, 1);
        await review.save();
        return res.status(200).json({ message: 'Review unliked', review });
      } else {
        return res.status(400).json({ message: 'User has not liked this review' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error unliking review', error });
    }
  });

  // Use the router
  app.use('/api', router);
  

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });