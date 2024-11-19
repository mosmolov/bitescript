import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, MapPin, CreditCard, Car } from "lucide-react";
import Navbar from "./Navbar";
import ReviewModal from "./ReviewModal";
const RestaurantPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [restaurantImages, setRestaurantImages] = useState([]);
  const { id } = useParams();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatHours = (hours) => {
    if (!hours || hours.length === 0)
      return [<div key="none">Hours not available</div>];

    const daysOrder = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const sortedHours = [...hours].sort(
      (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
    );

    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    return sortedHours.map((h) => (
      <div key={h.day} className="flex justify-between py-1">
        <span
          className={`font-medium ${
            h.day === currentDay ? "text-blue-600" : ""
          }`}
        >
          {h.day}
        </span>
        <span>{`${h.open}0 - ${h.close}0` || "Closed"}</span>
      </div>
    ));
  };

  const fetchFoodImages = async () => {
    try {
      const images = await Promise.all(
        Array(3)
          .fill()
          .map(async () => {
            const response = await fetch("https://foodish-api.com/api");
            const data = await response.json();
            return data.image;
          })
      );
      setRestaurantImages(images);
    } catch (error) {
      console.error("Error fetching food images:", error);
      setRestaurantImages([]);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/api/posts/restaurant/${id}`
        );
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
    fetchFoodImages();
  }, [id]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5050/api/restaurants/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          // Call isCurrentlyOpen method from the backend
          const openStatus = await fetch(
            `http://localhost:5050/api/restaurants/${id}/status`
          );
          const { isOpen } = await openStatus.json();
          setIsOpen(isOpen);
          setRestaurant(data);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleAddReview = async (reviewData) => {
    try {
      const response = await fetch(`http://localhost:5050/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          restaurantId: id,
        }),
      });

      if (response.ok) {
        // Refresh posts after adding new review
        const updatedPosts = await fetch(
          `http://localhost:5050/api/posts/restaurant/${id}`
        );
        const data = await updatedPosts.json();
        setPosts(Array.isArray(data) ? data : data.posts || []);
        setShowReviewModal(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4">Loading...</div>
      </>
    );
  }

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto p-4">Restaurant not found</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAE8E0]">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <div className="w-full bg-[#EAE8E0] rounded-lg p-6">
          <div className="relative">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(restaurant.averageRating)}
                  <span className="text-gray-600">
                    ({restaurant.totalRatings} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <span>{restaurant.cuisine.join(", ")}</span>
                  <span>•</span>
                  <span
                    className={`font-medium ${
                      isOpen ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{`${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip}`}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => navigate("/search")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hours Section */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hours
              </h3>
              <div className="space-y-1">
                {restaurant.hours && restaurant.hours.length > 0 ? (
                  formatHours(restaurant.hours)
                ) : (
                  <div>Hours not available</div>
                )}
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="bg-white p-4 rounded-lg">
              <div className="space-y-4">
                {restaurant.payments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Options
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.payments.map((payment) => (
                        <span
                          key={payment}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {payment}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {restaurant.parking.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Parking
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.parking.map((option) => (
                        <span
                          key={option}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {restaurantImages.map((imageUrl, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Restaurant food ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 font-medium"
            >
              See more
            </button>
            <button
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 font-medium"
              onClick={() => setShowReviewModal(true)}
            >
              Been there? Add a review
            </button>
          </div>

          {expanded && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Posts</h3>
              <p className="text-gray-600 mb-4">
                Recent posts from this restaurant
              </p>

              <div className="space-y-4">
                {posts &&
                  posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 bg-white border rounded-lg shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-gray-600 mt-1">{post.content}</p>
                          {post.rating && (
                            <div className="mt-2">
                              {renderStars(post.rating)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {post.author?.username || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        restaurant={restaurant}
        userId={JSON.parse(localStorage.getItem("user"))._id}
      />
    </div>
  );
};

export default RestaurantPage;
