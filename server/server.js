import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";


dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

mongoose
  .connect(process.env.ATLAS_URI)   //connect to the database
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

//middleware 
app.use(cors());                //allows controlled access from server to different domains
app.use(express.json());        //parses incoming json requests

//routes
app.use('api/auth',authRoutes);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
