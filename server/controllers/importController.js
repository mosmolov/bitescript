// import csv-parser for parsing CSV files
import csv from "csv-parser";
// import fs for file system operations
import fs from "fs";
// import path for handling file paths
import path, { parse, resolve } from "path";
import { fileURLToPath } from "url";
import Restaurant from "../models/restaurant";
import { rejects } from "assert";

// fileURLToPath() converts a file URL into a file path that's usable in Node.js.
// It basically strips off the file:// part and converts any URL-specific characters.
// After this conversion, we get a regular file path like /Users/yourusername/projects/yourproject/controllers/importController.js
const __filename = fileURLToPath(import.meta.url);
// path.dirname() takes a file path and returns just the directory part of it.
// So if we pass in /Users/yourusername/projects/yourproject/controllers/importController.js, it returns /Users/yourusername/projects/yourproject/controllers
const __dirname = path.dirname(__filename);

export const importRestaurants = async () => {
  // A Promise is like a placeholder for the result of an asynchronous operation.
  // resolve is called when the asynchronous operation is successful. It changes the state of the Promise to "fulfilled". The value passed to resolve becomes the result of the Promise.
  // reject is called when the asynchronous operation fails. It changes the state of the Promise to "rejected". The error passed to reject becomes the reason for the Promise's failure.
  return new Promise((resolve, reject) => {
    const results = [];

    // creates a readable stream from the specified file.
    fs.createReadStream(path.join(__dirname, "..", "dataset", "geoplaces2.csv"))
      // pipe() is a method used to connect readable streams to writable streams.
      // csv() is a parser from the csv-parser library that transforms the raw CSV data into JavaScript objects.
      // Each line of the CSV is converted into an object where the keys are the column headers and the values are the cell contents.
      .pipe(csv())
      // Event listener for each row of parsed CSV data, adds each row to the results array
      .on("data", (data) => results.push(data))
      // Event listener for when file reading is complete, place for final processing of the collected data
      .on("end", async () => {
        try {
          // Once the file is fully read, we iterate over each row in the results array.
          for (const row of results) {
            // For each row, we create a restaurantData object that matches our schema structure.
            const restaurantData = {
              placeID: row.placeID,
              name: row.name,
              address: row.address || "",
              city: row.city || "",
              state: row.state || "",
              zip: row.zip || "",
              location: {
                type: "Point",
                coordinates: [
                  parseFloat(row.longtitude),
                  parseFloat(row.latitude),
                ],
              },
            };

            await Restaurant.findOneAndUpdate(
              { placeID: row.placeID },
              restaurantData,
              // The upsert: true option means it will create a new document if one doesn't exist with the given placeID.
              // new: true returns the updated document.
              // runValidators: true ensures that the data meets our schema requirements.
              { upsert: true, new: true, runValidators: true }
            );
          }
          console.log("Restaurant data imported successfully");
          resolve();
        } catch (error) {
          console.error("Error importing restaurant data", error);
          reject(error);
        }
      });
  });
};

export const importCuisines = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "chefmozcuisine.csv")
    )
      .pipe(csv())
      .on("data", async (row) => {
        try {
          await Restaurant.findOneAndUpdate(
            { placeID: row.placeID },
            // $addToSet is a MongoDB update operator used to add elements to an array field.
            { $addToSet: { cuisine: row.Rcuisine } },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating cuisine:", error);
        }
      })
      .on("end", () => {
        console.log("Cuisine import completed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading cuisine CSV:", error);
        reject(error);
      });
  });
};

export const importParking = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "chefmozparking.csv")
    )
      .pipe(csv())
      .on("data", async (row) => {
        try {
          await Restaurant.findOneAndUpdate(
            { placeID: row.placeID },
            { $addToSet: { parking: row.parking_lot } },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating parking", error);
        }
      })
      .on("end", () => {
        console.log("Parking imported completed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading parking CSV", error);
        reject(error);
      });
  });
};

export const importPayments = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "chefmozaccepts.csv")
    )
      .pipe(csv())
      .on("data", async (row) => {
        try {
          await Restaurant.findOneAndUpdate(
            { placeID: row.placeID },
            { $addToSet: { payments: row.Rpayment } },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating payments", error);
        }
      })
      .on("end", () => {
        console.log("Payments imported completed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading payment CSV", error);
        reject(error);
      });
  });
};

const parseHours = (hoursString, daysString) => {
  // Splits the hours into open and close times.
  const [open, close] = hoursString.split("-");
  // Splits the days string into an array of individual days. "Monday;Tuesday;;Wednesday; ;Friday;" -> [Monday, Tuesday, Wednesday, Friday]
  const days = daysString.split(";").filter((day) => day.trim() !== "");
  // Creates an object for each day with the opening and closing times.
  return days.map((day) => ({
    day: day.trim(),
    open: open.trim(),
    close: close.trim(),
  }));
};

export const importOpenHours = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "chefmozhours4.csv")
    )
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const hours = parseHours(row.hours, row.days);
          await Restaurant.findOneAndUpdate(
            { placeID: row.placeID },
            // Push each object in the hours array to the restaurant's hours filed
            { $push: { hours: { $each: hours } } },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating hours", error);
        }
      })
      .on("end", () => {
        console.log("Hours import completed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading hours CSV", error);
        reject(error);
      });
  });
};

export const importRatings = async () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "rating_final.csv")
    )
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const rating = {
            userId: row.userId, // Keep as String, no conversion needed
            rating: parseFloat(row.rating),
            food_rating: parseFloat(row.food_rating),
            service_rating: parseFloat(row.service_rating),
            date: new Date(),
          };

          await Restaurant.findOneAndUpdate(
            { placeID: row.placeID },
            {
              // Adds the new rating object to the ratings array
              $push: { ratings: rating },
              // Increment the totalRatings field by 1.
              $inc: { totalRatings: 1 },
              // Add the new rating, increment the total number of ratings, recaculate the average rating
              $set: {
                averageRating: {
                  $avg: { $concatArrays: ["$ratings.rating", [rating.rating]] },
                },
              },
            },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error updating rating:", error);
        }
      })
      .on("end", () => {
        console.log("Ratings import completed");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading ratings CSV:", error);
        reject(error);
      });
  });
};