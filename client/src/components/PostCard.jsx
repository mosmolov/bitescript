import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Star,
  Utensils,
  UserCircle,
  UserCog,
} from "lucide-react";

const PostCard = ({ post, onUpdate, refreshPost }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isLiked = post.likes?.includes(currentUser?._id);

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

  useEffect(() => {
    if (showComments) {
      const intervalId = setInterval(() => {
        refreshPost();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [showComments, refreshPost]);

  const handleLike = async () => {
    if (!currentUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5050/api/posts/${post._id}/likes`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
        setTimeout(refreshPost, 500);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5050/api/posts/${post._id}/comments`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser._id,
            commentText: newComment,
          }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
        setNewComment("");
        setTimeout(refreshPost, 500);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {post.author?.picture ? (
              <img
                src={post.author.picture}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#DFB839] flex items-center justify-center text-white font-bold text-lg">
                {post.author?.firstName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {post.author?.firstName} {post.author?.lastName}
              </p>
              {post.author?.username && (
                <span className="text-gray-500 text-sm">
                  @{post.author.username}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-[#DFB839] text-[#DFB839]" />
          <span className="font-medium">{post.rating}/5</span>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{post.title}</h2>
          {(post.food_rating || post.service_rating) && (
            <div className="flex items-center gap-3 text-sm">
              {post.food_rating && (
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4 text-gray-600" />
                  <span>{post.food_rating}/5</span>
                </div>
              )}
              {post.service_rating && (
                <div className="flex items-center gap-1">
                  <UserCog className="w-4 h-4 text-gray-600" />
                  <span>{post.service_rating}/5</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="aspect-video relative">
        <img src={imageUrl} alt="Food" className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <p className="text-gray-700">{post.content}</p>
      </div>

      <div className="px-4 pb-2 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>{post.likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="border-t pt-3">
            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#DFB839] focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!currentUser}
                className="px-4 py-2 bg-[#DFB839] text-black rounded-full font-medium hover:bg-[#DFB839]/90 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </form>

            <div className="space-y-3">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {comment.userId?.username}
                    </p>
                    <p className="text-gray-700">{comment.commentText}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.datePosted).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
