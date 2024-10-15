import mongoose from "mongoose";
import dotenv from "dotenv";
import { importRatings } from "./controllers/importController.js";
import Restaurant from "./models/restaurant.js";

dotenv.config();

const MONGODB_URI = process.env.ATLAS_URI;

async function reimportRatings() {
  const startTime = Date.now();
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing ratings...");
    await Restaurant.updateMany(
      {},
      { $set: { ratings: [], totalRatings: 0, averageRating: 0 } }
    );
    console.log("Existing ratings cleared");

    console.log("Starting ratings import...");
    await importRatings();
    console.log("Ratings import completed");

    const sampleRestaurant = await Restaurant.findOne({ ratings: { $ne: [] } });
    console.log("Sample restaurant with ratings:", sampleRestaurant);
  } catch (error) {
    console.error("Error during reimport:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    const endTime = Date.now();
    console.log(
      `Total execution time: ${(endTime - startTime) / 1000} seconds`
    );
  }
}

reimportRatings();
