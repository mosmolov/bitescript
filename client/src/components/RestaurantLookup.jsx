import React, { useState, useEffect } from "react";
import logo from "../logo.png";
import Compass from "../Compass.png";
import Search from "../Search.png";
import Profile from "../Profile.png";
import { Link } from "react-router-dom";
const RestaurantSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [countries, setCountries] = useState({});
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
  useEffect(() => {
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
      <nav className="w-full px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Bitescript Logo" className="h-24 mr-2" />
          </Link>
        </div>
        <div className="flex space-x-6 text-lg">
          <Link to="/">
            <button className="flex items-center space-x-2">
              <img src={Compass} alt="" />
              <span>Feed</span>
            </button>
          </Link>
          <Link to="/search">
            <button className="flex items-center space-x-2">
              <img src={Search} alt="" />
              <span>Search</span>
            </button>
          </Link>
          {/* <Link to={"/profile"}> */}
            <button className="flex items-center space-x-2">
              <img src={Profile} alt="" />
              <span>Profile</span>
              {/* <Link to="/profile">Profile</Link> */}
            </button>
          {/* </Link> */}
        </div>
      </nav>
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
            className="bg-white border border-black rounded-xl p-4 mb-4 flex justify-between items-center relative"
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
            <button className="text-2xl">+</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantSearchPage;
