import React, { useEffect, useState } from "react";
import logo from "../logo.png";
import Compass from "../Compass.png";
import Search from "../Search.png";
import Profile from "../Profile.png";
import { Link, useNavigate, useParams } from "react-router-dom";

// TODO: make nav its own component

const ProfilePage = ({ user }) => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5050/api/users/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setProfileUser(data.user));
    if (!user) window.location.href = "/login";
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5050/api/restaurants/top-rated?page=1&limit=30`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setTopRatedRestaurants(data))
      .catch((error) =>
        console.error("Error fetching top-rated restaurants:", error)
      );
  }, []);

  if (!profileUser) return <h1>Unknown User</h1>;

  const isOwnPage = profileUser._id === user?._id;

  let buttonUsage = "";
  if (!user) buttonUsage = "log in";
  else if (isOwnPage) buttonUsage = "edit profile";
  else if (!user.following.includes(profileUser._id)) buttonUsage = "follow +";
  else buttonUsage = "following";

  const handleButton = () => {
    switch (buttonUsage) {
      case "log in": {
        navigate("../../login", { relative: true });
        break;
      }
      case "edit profile": {
        alert("editting profile!");
        break;
      }
      case "follow +": {
        // TODO: handle follow
        break;
      }
      case "following": {
        // TODO: handle following
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className="h-full bg-[#EAE8E0] flex flex-col items-center text-center">
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
          {/* <Link to={user ? "/profile" : "/login"}> */}
            <button className="flex items-center space-x-2">
              <img src={Profile} alt="" />
              {/* <Link to="/profile">Profile</Link> */}
              <span>Profile</span>
            </button>
          {/* </Link> */}
        </div>
      </nav>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-row gap-4">
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
              {profileUser.firstName[0].toUpperCase()}
              {profileUser.lastName[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileUser.firstName} {profileUser.lastName}
              </h2>
              <p className="text-gray-600">@{profileUser.username}</p>
              <p className="text-gray-500">⚲ Atlanta, GA</p>
            </div>
          </div>

          <div className="flex flex-row gap-5">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {profileUser.followers.length}
              </p>
              <p className="text-gray-500">Followers</p>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {profileUser.following.length}
              </p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>

          <div>
            <button
              className="w-fit px-4 py-2 bg-[#DFB839] text-black font-semibold text-med rounded-full"
              onClick={handleButton}
            >
              {buttonUsage}
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3
            className="text-4xl text-left font-handwritten font-bold text-gray-900"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            My top 20
          </h3>
          <SlidingCards>
            {topRatedRestaurants.slice(0, 20).map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                name={restaurant.name}
                location={`${restaurant.city}, ${restaurant.state}`}
              />
            ))}
          </SlidingCards>
        </div>

        <div className="p-6">
          <h3
            className="text-4xl text-left font-handwritten font-bold text-gray-900"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            Been there...love it
          </h3>
          <SlidingCards>
            {topRatedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                name={restaurant.name}
                location={`${restaurant.city}, ${restaurant.state}`}
              />
            ))}
          </SlidingCards>
        </div>
      </div>
    </div>
  );
};

const RestaurantCard = ({ name, location }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Fetch the random image from the Foodish API
    const fetchImage = async () => {
      try {
        const response = await fetch("https://foodish-api.com/api");
        const data = await response.json();
        setImageUrl(data.image); // Set the image URL
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage(); // Call the async function inside useEffect
  }, []);

  return (
    <div
      className="h-40 w-40 bg-white rounded-lg shadow-md flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${imageUrl})`, // Apply the random image as the background
        backgroundSize: "cover", // Ensure the image covers the card
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Prevent image tiling
      }}
    >
      <h4 className="font-bold text-white">{name}</h4>{" "}
      {/* Use white text for better contrast */}
      <p className="text-sm text-white">{location}</p>
    </div>
  );
};

const SlidingCards = ({ children }) => {
  return (
    <div className="flex overflow-x-scroll">
      <div className="flex flex-nowrap gap-4 p-6">{children}</div>
    </div>
  );
};

export default ProfilePage;
