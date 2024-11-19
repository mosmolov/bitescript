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
restaurant.pre("save", async function (next) {
  if (this.isModified('ratings')) {  // Only run if ratings array was modified
    if (this.ratings && this.ratings.length > 0) {
      const sum = this.ratings.reduce((acc, curr) => {
        return {
          rating: acc.rating + curr.rating,
          food_rating: acc.food_rating + (curr.food_rating || 0),
          service_rating: acc.service_rating + (curr.service_rating || 0)
        };
      }, { rating: 0, food_rating: 0, service_rating: 0 });

      const count = this.ratings.length;
      this.averageRating = (sum.rating / count).toFixed(1);
      this.totalRatings = count;
    } else {
      this.averageRating = 0;
      this.totalRatings = 0;
    }
  }
  next();
});
// This middleware runs on every save, not just when ratings change
// Might want to optimize this to run only when the ratings array is modified

restaurant.methods.isCurrentlyOpen = function() {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Convert current time to minutes since midnight for easier comparison
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;
  
  const todayHours = this.hours.find(h => h.day === currentDay);
  if (!todayHours) return false;
  
  // Convert store hours to minutes since midnight
  const [openHour, openMinute] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  // debug logging
  console.log('Current time:', currentTimeInMinutes);
  console.log('Open time:', openTimeInMinutes);
  console.log('Close time:', closeTimeInMinutes);
  
  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
};

restaurant.methods.getFormattedHours = function() {
  return this.hours.map(h => ({
    day: h.day,
    hours: `${formatTime(h.open)} - ${formatTime(h.close)}`
  }));
};

// Helper function to format 24h time to 12h format
function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

const Restaurant = mongoose.model("restaurant", restaurant);

export default Restaurant;