import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import importRoutes from "./routes/importRoutes.js";

// Load environment variables
dotenv.config();

// Set port, defaulting to 5050 if not specified in .env
const PORT = process.env.PORT || 5050;

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", importRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Error handling for unhandled promises
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});
