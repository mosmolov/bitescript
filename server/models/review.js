const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
    restaurant_id: Number,
    user_id: Number,
    overall_rating: Number,
    food_rating: Number,
    service_rating: Number,
    review_text: { type: String, maxlength: 2500 },
    amount_spent: Number,
    photo_url: String,
    review_date: { type: Date, default: Date.now },
  });
  
export default mongoose.model('Review', reviewSchema);