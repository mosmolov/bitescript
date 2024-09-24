const Review = require('../models/review');

exports.getReviewByID = async (req, res) => {
    const reviews = await Review.find({ restaurant_id: req.params.id });
    res.json(reviews);
  };