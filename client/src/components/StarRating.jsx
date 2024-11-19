import { Star } from "lucide-react";
import React from "react";

const StarRating = ({
  typeOfRating,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
}) => {
  return (
    <div>
      <h3 
        className="font-handwritten text-xl mb-2"
        style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
      >
        {typeOfRating}
      </h3>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transform transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={`transition-colors duration-150 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;