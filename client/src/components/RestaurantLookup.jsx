import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModal";
const RestaurantSearchPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [countries, setCountries] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const handleOpenModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRestaurant(null);
    setIsModalOpen(false);
  };

  const getCountryFromCoordinates = async (coordinates, restaurantId) => {
    try {
      const [lng, lat] = coordinates;
      if (countries[restaurantId]) {
        return;
      }
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      setCountries((prev) => ({
        ...prev,
        [restaurantId]: data.address.country,
      }));
    } catch (err) {
      console.error("Error fetching country:", err);
      setCountries((prev) => ({ ...prev, [restaurantId]: "" }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    setUserId(userData._id);
    if (!userData._id) {
      navigate("/login");
    }
    const fetchRestaurants = async () => {
      if (searchQuery) {
        try {
          const page = 1; // Set default page number or make it dynamic
          const limit = 10; // Set default limit or make it dynamic
          const response = await fetch(
            `http://localhost:5050/api/restaurants/search?query=${searchQuery}&page=${page}&limit=${limit}`
          );
          const data = await response.json();
          setRestaurants(data);

          // Fetch country for each restaurant with coordinates
          data.forEach((restaurant) => {
            if (restaurant.location?.type === "Point") {
              getCountryFromCoordinates(
                restaurant.location.coordinates,
                restaurant.id
              );
            }
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        setRestaurants([]);
      }
    };
    fetchRestaurants();
  }, [searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#EAE8E0] p-4">
     <Navbar />
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center mb-6 justify-center align-center">
          {/* <button className="text-2xl mr-4">&#x2190;</button> */}
          <h1
            className="text-5xl font-handwritten mb-10"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            find your next bite
          </h1>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
          />
        </div>

        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white border border-black rounded-xl p-4 mb-4 flex justify-between items-center relative cursor-pointer"
            onClick={() => handleRestaurantClick(restaurant._id)}
          >
            {/* Rating Badge */}
            <div
              className={`absolute top-2 right-4 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center ${
                restaurant.averageRating >= 4
                  ? "bg-green-500"
                  : restaurant.averageRating >= 3
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {restaurant.averageRating.toFixed(1)}
            </div>
            <div>
              <h2 className="font-bold text-xl">
                {restaurant.name} {restaurant.price}
              </h2>
              <p className="text-gray-600">
                {restaurant.cuisine.slice(0, 4).join(" | ")}
              </p>
              <p className="text-gray-600">
                {restaurant.city}, {restaurant.state}
              </p>
              <p className="text-gray-600">
                {restaurant.location?.type === "Point" ? (
                  <>
                    <span>
                      {countries[restaurant.id]
                        ? `${countries[restaurant.id]}`
                        : ""}
                    </span>
                  </>
                ) : (
                  restaurant.location
                )}
              </p>
            </div>
            <button
              className="text-2xl"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(restaurant);
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <ReviewModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
      />
    </div>
  );
};

export default RestaurantSearchPage;
