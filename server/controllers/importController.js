// import csv-parser for parsing CSV files
import csv from "csv-parser";
// import fs for file system operations
import fs from "fs";
// import path for handling file paths
import path, { parse, resolve } from "path";
import { fileURLToPath } from "url";
import Restaurant from "../models/restaurant.js";

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
    let rowCount = 0;
    let skippedCount = 0;
    let successCount = 0;

    // creates a readable stream from the specified file.
    fs.createReadStream(path.join(__dirname, "..", "dataset", "geoplaces2.csv"))
      // pipe() is a method used to connect readable streams to writable streams.
      // csv() is a parser from the csv-parser library that transforms the raw CSV data into JavaScript objects.
      // Each line of the CSV is converted into an object where the keys are the column headers and the values are the cell contents.
      .pipe(csv())
      // Event listener for each row of parsed CSV data, adds each row to the results array
      .on("data", async (row) => {
        rowCount++;
        try {
          const longitude = parseFloat(row.longitude);
          const latitude = parseFloat(row.latitude);

          if (isNaN(longitude) || isNaN(latitude)) {
            console.log(
              "Skipping row ${rowCount} due to invalid coordinates: longtitude=${row.longtitude}, latitude=${row.latitude}"
            );
            skippedCount++;
            return;
          }

          const restaurantData = {
            placeID: row.placeID,
            name: row.name,
            address: row.address || "",
            city: row.city || "",
            state: row.state || "",
            zip: row.zip || "",
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
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
          successCount++;
        } catch (error) {
          console.error(`Error processing row ${rowCount}:`, error.message);
          skippedCount++;
        }
      })
      // Event listener for when file reading is complete, place for final processing of the collected data
      .on("end", () => {
        console.log(`Import completed. Processed ${rowCount} rows.`);
        console.log(`Successfully imported: ${successCount}`);
        console.log(`Skipped: ${skippedCount}`);
        resolve();
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        reject(error);
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
  const ratingsByRestaurant = new Map();
  let rowCount = 0;

  return new Promise((resolve, reject) => {
    console.log("Starting to read CSV file...");
    fs.createReadStream(
      path.join(__dirname, "..", "dataset", "rating_final.csv")
    )
      .pipe(csv())
      .on("data", (row) => {
        rowCount++;
        if (rowCount % 10000 === 0) {
          console.log(`Processed ${rowCount} rows`);
        }

        const rating = {
          userId: row.userID,
          rating: parseFloat(row.rating),
          food_rating: parseFloat(row.food_rating),
          service_rating: parseFloat(row.service_rating),
          date: new Date(),
        };

        if (!ratingsByRestaurant.has(row.placeID)) {
          ratingsByRestaurant.set(row.placeID, []);
        }
        ratingsByRestaurant.get(row.placeID).push(rating);
      })
      .on("end", async () => {
        console.log(`Finished reading CSV. Total rows: ${rowCount}`);
        console.log(
          `Number of unique restaurants: ${ratingsByRestaurant.size}`
        );
        try {
          console.log("Preparing bulk write operations...");
          const bulkOps = [];

          for (const [placeID, ratings] of ratingsByRestaurant) {
            const totalRatings = ratings.length;
            const averageRating =
              ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

            bulkOps.push({
              updateOne: {
                filter: { placeID: placeID },
                update: {
                  $set: { ratings, totalRatings, averageRating },
                },
                upsert: true,
              },
            });
          }

          console.log(
            `Starting bulk write for ${bulkOps.length} operations...`
          );
          const result = await Restaurant.bulkWrite(bulkOps);
          console.log("Bulk write completed. Result:", result);

          console.log("Ratings import completed");
          resolve();
        } catch (error) {
          console.error("Error updating ratings:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error reading ratings CSV:", error);
        reject(error);
      });
  });
};

//Read and parse the JSON file
let jsonData = "";
try {
  jsonData = fs.readFileSync(path.join(__dirname, "..", "dataset", "yelp_academic_dataset_business.json"), 'utf-8');
} catch (error) {
  console.warn("Yelp dataset not found, skipping Yelp data import.");
}
const restaurantsData = jsonData.split('\n').filter(line => line).map(line => JSON.parse(line));

// Transform the data to match your schema
const transformedRestaurants = restaurantsData
  .filter((data) => data.categories && data.categories.includes("Food"))
  .map((data) => {
    return {
      placeID: data.business_id,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.postal_code,
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
      cuisine: data.categories
        ? data.categories.split(",").map((cat) => cat.trim())
        : [],
      totalRatings: data.review_count,
      averageRating: data.stars,
      parking: "",
      hours: data.hours
        ? Object.entries(data.hours).map(([day, time]) => {
            const [open, close] = time.split("-");
            return { day, open, close };
          })
        : [],
      payments:
        data.attributes?.BusinessAcceptsCreditCards === "True"
          ? ["Credit Card"]
          : [],
    };
  });

export const importYelpData = async () => {
  try {
    await Restaurant.insertMany(transformedRestaurants);
    // delete if categories doesn't include "Food"
    console.log("Yelp data imported successfully");
  } catch (error) {
    console.error("Error importing Yelp data:", error);
  }
};