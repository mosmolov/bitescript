import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import importRoutes from "./routes/importRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import Restaurant from "./models/restaurant.js";

// Load environment variables
dotenv.config();

// Set port, defaulting to 5050 if not specified in .env
const PORT = process.env.PORT || 5050;

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.ATLAS_URI)   //connect to the database
  .then(() => {
    console.log("Connected to MongoDB");
    // It provides an automated way to ensure your database indexes always match your schema definition, which can prevent subtle bugs and performance issues in the future.
    return Restaurant.syncIndexes();
  })
  .then(() => {
    console.log("Indexes are synchronized");
  })
  .catch((err) => {
    console.error(err);
  });

//middleware 
app.use(cors());                //allows controlled access from server to different domains
app.use(express.json());        //parses incoming json requests

// Routes
app.use("/api", importRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use('/api/auth',authRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Error handling for unhandled promises
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});
