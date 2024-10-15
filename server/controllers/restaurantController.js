import Restaurant from "../models/restaurant.js";

// Search restaurants by name, cuisine, or keywords
export const getRestaurants = async (req, res) => {
  try {
    // Extract query, page, and limit from req.query or use default values
    const { query, page = 1, limit = 10 } = req.query;
    // Calculates how many documents to skip for pagination
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(
      // Looks for the query text in all text-indexed fields
      { $text: { $search: query } },
      // Adds a score field to the results, indicating how well each document matched the search.
      { score: { $meta: "textScore" } }
    )
      // Sorts the results by the text match score.
      .sort({ score: { $meta: "textScore" } })
      // Implements pagination by skipping some results and limiting the number returned.
      .skip(skip)
      .limit(parseInt(limit));

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nearby restaurants
export const getNearbyRestaurants = async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      maxDistance = 5000,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopRatedRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find()
      .sort({ averageRating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter restaurants
export const filterRestaurants = async (req, res) => {
  try {
    const { cuisine, minRating, maxPrice, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Initializes an empty object to build our MongoDB query.
    let query = {};
    // If a cuisine was provided in the query parameters, it adds it to the query object.
    if (cuisine) query.cuisine = cuisine;
    // If minRating was provided, it adds a condition to the query.
    // $gte means "greater than or equal to" in MongoDB.
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
    // If maxPrice was provided, it adds a condition to the query.
    // $lte means "less than or equal to" in MongoDB.
    if (maxPrice) query.price = { $lte: parseInt(maxPrice) };

    // Search the database using the constructed query object
    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
