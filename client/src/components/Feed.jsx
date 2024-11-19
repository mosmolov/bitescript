import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PostCard from "./PostCard";
const Feed = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const navigate = useNavigate();
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5050/api/posts?page=${currentPage}&limit=${limit}`
      );
      const data = await response.json();

      if (currentPage === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === limit);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  // Initial fetch and setup polling
  useEffect(() => {
    fetchPosts();
    // Set up polling every 10 seconds
    const intervalId = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchPosts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePostUpdate = useCallback((updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#EAE8E0]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {loading && currentPage === 1 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DFB839]"></div>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
              refreshPost={async () => {
                try {
                  const response = await fetch(
                    `http://localhost:5050/api/posts/${post._id}`
                  );
                  if (response.ok) {
                    const updatedPost = await response.json();
                    handlePostUpdate(updatedPost);
                  }
                } catch (error) {
                  console.error("Error refreshing post:", error);
                }
              }}
            />
          ))}
        </div>

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">No posts yet</h2>
            <p className="text-gray-500 mt-2">
              Be the first to share your experience!
            </p>
          </div>
        )}

        {hasMore && posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
