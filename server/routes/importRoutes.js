import express from "express";
import * as importController from "../controllers/importController.js";

const router = express.Router();

router.post("/import-restaurant", async (req, res) => {
  try {
    await importController.importRestaurants();
    res.status(200).json({ message: "Restaurants imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import restaurant failed", details: error.message });
  }
});

router.post("/import-cuisines", async (req, res) => {
  try {
    await importController.importCuisines();
    res.status(200).json({ message: "Cuisines imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import cuisine failed", details: error.message });
  }
});

router.post("/import-parkings", async (req, res) => {
  try {
    await importController.importParking();
    res.status(200).json({ message: "Parkings imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import parkings failed", details: error.message });
  }
});

router.post("/import-payments", async (req, res) => {
  try {
    await importController.importPayments();
    res.status(200).json({ message: "Payments imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import payments failed", details: error.message });
  }
});

router.post("/import-openhours", async (req, res) => {
  try {
    await importController.importOpenHours();
    res.status(200).json({ message: "Open hours imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import open hours failed", details: error.message });
  }
});

router.post("/import-ratings", async (req, res) => {
  try {
    await importController.importRatings();
    res.status(200).json({ message: "Ratings imported successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Import ratings failed", details: error.message });
  }
});

export default router;
