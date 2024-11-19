import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import EditModal from "./EditModal";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = ({ user }) => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [userTopRestaurants, setUserTopRestaurants] = useState([]); // Ensure it's initialized as an array
  const [profileImage, setProfileImage] = useState("");
  const [profileUser, setProfileUser] = useState(null);
  const [buttonUsage, setButtonUsage] = useState("loading...");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Initialize loggedInUser from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [loggedInUser, setLoggedInUser] = useState(storedUser);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    }
  }, [navigate]); // Remove loggedInUser from dependencies

  // First useEffect to fetch profile user data
  useEffect(() => {
    fetch(`http://localhost:5050/api/users/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileUser(data.user);
        setProfileImage(data.user?.picture); // Move this inside the then block
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [id]); // Remove profileUser from dependencies

  // Button text effect
  useEffect(() => {
    if (!loggedInUser || !profileUser) return;

    if (loggedInUser._id === profileUser._id) {
      setButtonUsage("edit profile");
    } else {
      setButtonUsage(
        loggedInUser.following?.includes(profileUser._id)
          ? "following"
          : "follow +"
      );
    }
  }, [profileUser, loggedInUser]);

  // Fetch restaurants and profile image
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

  // Modify the useEffect that fetches user's posts
  useEffect(() => {
    if (!profileUser) return;

    // Reset userTopRestaurants before fetching new data
    setUserTopRestaurants([]);

    fetch(`http://localhost:5050/api/posts/${profileUser._id}`, {
        method: "GET",
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
          console.log(data);
            if (!Array.isArray(data) || data.length === 0) {
                setUserTopRestaurants(topRatedRestaurants);
                return;
            }

            // Create a Set to track unique restaurant IDs
            const uniqueRestaurantIds = new Set();
            const fetchPromises = data
                .filter(post => {
                    // Only include restaurants we haven't seen yet
                    if (uniqueRestaurantIds.has(post.restaurant)) return false;
                    uniqueRestaurantIds.add(post.restaurant);
                    return true;
                })
                .map(post =>
                    fetch(`http://localhost:5050/api/restaurants/${post.restaurant}`)
                        .then(res => res.json())
                        .catch(error => {
                            console.error(`Error fetching restaurant ${post.restaurant}:`, error);
                            return null;
                        })
                );

            Promise.all(fetchPromises)
                .then(restaurants => {
                    const validRestaurants = restaurants.filter(r => r != null);
                    setUserTopRestaurants(validRestaurants);
                });
        })
        .catch((error) => {
            console.error("Error fetching user's posts:", error);
            setUserTopRestaurants(topRatedRestaurants);
        });
}, [profileUser, topRatedRestaurants]);

  const handleFollowAction = async () => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    const isFollowing = buttonUsage === "following";
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      const response = await fetch(
        `http://localhost:5050/api/users/${profileUser._id}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: loggedInUser._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update loggedInUser state
      const updatedLoggedInUser = {
        ...loggedInUser,
        following: isFollowing
          ? loggedInUser.following.filter((id) => id !== profileUser._id)
          : [...new Set([...(loggedInUser.following || []), profileUser._id])],
      };

      localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
      setLoggedInUser(updatedLoggedInUser);

      // Update profileUser with the response data
      setProfileUser(data.user);
      setButtonUsage(isFollowing ? "follow +" : "following");

      toast.success(data.message, {
        duration: 2000,
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast.error("Failed to update follow status");
    }
  };
  const handleButton = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Add this to prevent event bubbling

    if (!loggedInUser) {
      // Check loggedInUser instead of user prop
      navigate("/login");
      return;
    }

    switch (buttonUsage) {
      case "edit profile": {
        setIsEditModalOpen(true);
        break;
      }
      case "follow +":
        handleFollowAction();
        break;
      case "following": {
        handleFollowAction();
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    navigate("/login"); // Navigate to login page
  };
  const handleProfileUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
    setProfileImage(updatedUser.picture || ""); // Update profile image when profile is updated
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser && loggedInUser._id === updatedUser._id) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  if (!profileUser) return <div>Loading...</div>;

  return (
    <div className="h-full bg-[#EAE8E0] flex flex-col items-center text-center">
      <Toaster position="top-right" />
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-row items-center justify-between p-6">
          {/* Profile Image and Info */}
          <div className="flex flex-row gap-4">
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                `${profileUser.firstName[0].toUpperCase()}${profileUser.lastName[0].toUpperCase()}`
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileUser.firstName} {profileUser.lastName}
              </h2>
              <p className="text-gray-600">@{profileUser.username}</p>
              <p className="text-gray-500">⚲ Atlanta, GA</p>
            </div>
          </div>

          {/* Followers/Following Count */}
          <div className="flex flex-row gap-5">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {profileUser.followers?.length || 0}
              </p>
              <p className="text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {profileUser.following?.length || 0}
              </p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>

          {/* Edit Profile and Logout Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`w-fit px-4 py-2 font-semibold text-med rounded-full transition-all duration-200 ${
                buttonUsage === "following"
                  ? "bg-emerald-500 text-white hover:bg-red-500 hover:text-white"
                  : buttonUsage === "edit profile"
                  ? "bg-[#DFB839] text-black hover:bg-[#c9a633]"
                  : "bg-[#DFB839] text-black hover:bg-[#c9a633]"
              }`}
              onClick={handleButton}
              disabled={buttonUsage === "loading..."}
              onMouseEnter={(e) => {
                if (buttonUsage === "following") {
                  e.target.textContent = "Unfollow";
                }
              }}
              onMouseLeave={(e) => {
                if (buttonUsage === "following") {
                  e.target.textContent = "following";
                }
              }}
            >
              {buttonUsage || "loading..."}
            </button>
            {buttonUsage === "edit profile" && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-fit px-4 py-2 bg-red-500 text-white font-semibold text-med rounded-full hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3
            className="text-4xl text-left font-handwritten font-bold text-gray-900"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            {profileUser._id === loggedInUser?._id
              ? "My"
              : `${profileUser.firstName}'s`}{" "}
            top 20
          </h3>
          <SlidingCards>
            {userTopRestaurants.slice(0, 20).map((restaurant) => (
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

      <EditModal
        user={profileUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

const RestaurantCard = ({ name, location }) => {
  const [imageUrl, setImageUrl] = useState("");

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

  return (
    <div
      className="h-40 w-40 bg-white rounded-lg shadow-md flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h4 className="font-bold text-white">{name}</h4>
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
