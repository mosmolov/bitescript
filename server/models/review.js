const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // assuming you have a User model
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',  // assuming you have a Restaurant model
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // assuming you have a User model
    required: true
  },
  overall_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  food_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  service_rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review_text: {
    type: String,
    maxlength: 2500
  },
  amount_spent: Number,
  photo_url: String,
  review_date: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'  // referencing User model for likes
  }],
  comments: [commentSchema]  // an array of embedded comment objects
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;