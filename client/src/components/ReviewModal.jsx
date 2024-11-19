import React, { useState, useEffect } from "react";
import StarRating from "./StarRating.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";

const ReviewModal = ({ restaurant, isOpen, onClose, userId }) => {
  const [rating, setRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverFoodRating, setHoverFoodRating] = useState(0);
  const [hoverServiceRating, setHoverServiceRating] = useState(0);
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [imageUrl, setImageUrl] = useState("");
  // Add event listener for escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Add the event listener when the modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    // Clean up the event listener when the component unmounts or modal closes
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("https://foodish-api.com/api");
        const data = await response.json();
        setImageUrl(data.image);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  const handleSubmit = async () => {
    if (!rating || !title || !experience) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: experience,
          author: userId,
          restaurant: restaurant._id,
          rating: rating,
          food_rating: foodRating,
          service_rating: serviceRating,
          date_visited: date,
        }),
      });

      if (response.status === 201) {
        toast.success("Review posted successfully!", {
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#333",
          },
        });
        setTimeout(onClose, 1000);
      }
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("Failed to post review. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#EAE8E0] rounded-3xl p-6 w-full max-w-3xl relative flex gap-6 max-h-[90vh] overflow-y-auto">
          {/* Rest of your modal code stays the same */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          >
            ×
          </button>

          {/* Left side */}
          <div className="w-2/5">
            <h2 className="text-xl font-bold mb-4">{restaurant.name}</h2>
            <div className="bg-gray-200 rounded-xl w-full aspect-[4/3] mb-4">
              <img
                src={imageUrl}
                alt="Restaurant"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="w-3/5">
            <h3
              className="font-handwritten text-3xl mb-4"
              style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
            >
              My Review
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
              />

              <textarea
                placeholder="Your Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full h-32 p-2.5 rounded-lg bg-white border border-gray-200 resize-none"
              />

              <div className="space-y-3">
                <StarRating
                  typeOfRating="Overall Rating"
                  rating={rating}
                  setRating={setRating}
                  hoverRating={hoverRating}
                  setHoverRating={setHoverRating}
                />

                <StarRating
                  typeOfRating="Food Rating"
                  rating={foodRating}
                  setRating={setFoodRating}
                  hoverRating={hoverFoodRating}
                  setHoverRating={setHoverFoodRating}
                />

                <StarRating
                  typeOfRating="Service Rating"
                  rating={serviceRating}
                  setRating={setServiceRating}
                  hoverRating={hoverServiceRating}
                  setHoverRating={setHoverServiceRating}
                />
              </div>

              <div>
                <h3
                  className="font-handwritten text-xl mb-2"
                  style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
                >
                  Date Visited
                </h3>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  maxDate={new Date()}
                  className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                  placeholderText="Select date"
                  dateFormat="MMM d, yyyy"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewModal;
