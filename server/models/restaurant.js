import mongoose from "mongoose";

const restaurant = new mongoose.Schema({
  placeID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zip: { type: String, default: "" },
  location: {
    // enum: ["Point"] ensures that the type field can only be set to 'Point', mainting valid GeoJSON data
    type: { type: String, enum: ["Point"], required: true },
    // the coordinate array should contain exactly two numbers: [longtitude, latitude]
    coordinates: { type: [Number], required: true },
  },
  cuisine: [String],
  parking: [String],
  hours: [
    {
      day: String,
      open: String,
      close: String,
    },
  ],
  payments: [String],
  ratings: [
    {
      userId: String,
      rating: { type: Number, required: true, min: 0, max: 5 },
      food_rating: { type: Number, min: 0, max: 5 },
      service_rating: { type: Number, min: 0, max: 5 },
      comment: { type: String, maxLength: 500 },
      date: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0 },
  // Allows for quick access to the number of ratings without having to count the ratings array
  totalRatings: { type: Number, default: 0 },
});

// Create a geospatial index on the location field for efficient proximity searches, fiding nearby restaurants
restaurant.index({ location: "2dsphere" });
// Create an index on the averageRating filed in descending order for quickly retrieveing top-rated restaurants or sorting by rating
restaurant.index({ averageRating: -1 });
restaurant.index(
  {
    name: "text",
    cuisine: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      cuisine: 5,
      description: 1,
    },
  }
);

// This middleware function runs before every save operation on a restaurant document, automatically updates the averageRating and totalRatings filed based on the current state of the ratings array
restaurant.pre("save", function (next) {
  // Set up a pre-save middleware on the restaurant schema
  if (this.ratings.length > 0) {
    // Checks if there are any ratings for this restaurant
    this.averageRating =
      // Use reduce() to sum up all rating values
      this.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      // Divides the sum by the number of ratings to get the average
      this.ratings.length;
    // Sets totalRatings to the current number of ratings
    this.totalRatings = this.ratings.length;
  }
});
// This middleware runs on every save, not just when ratings change
// Might want to optimize this to run only when the ratings array is modified

const Restaurant = mongoose.model("restaurant", restaurant);

export default Restaurant;
