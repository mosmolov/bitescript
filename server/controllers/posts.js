import Post from "../models/posts.js";
import Comment from "../models/comments.js";
import Restaurant from "../models/restaurant.js";
import mongoose from "mongoose";

// Feed
export const getPosts = async (req, res) => { // works
    try {
        const posts = await Post.find(); // Fetch all posts
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving posts", error });
    }
}
// Get All of a User's Posts
export const getUserPosts = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const posts = await Post.find({ author: id })
            .populate('restaurant', 'name city state')
            .sort({ createdAt: -1 });

        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getUserPosts:", error);
        res.status(500).json({ 
            message: "Error retrieving posts", 
            error: error.message 
        });
    }
}
export const createPost = async (req, res) => {
    const postData = req.body;
    console.log('Received post data:', postData); // Debug log

    try {
        // Validate required fields
        if (!postData.author || !postData.restaurant || !postData.rating) {
            console.log('Missing required fields:', postData); // Debug log
            return res.status(400).json({ message: "Missing required fields" });
        }

        // First update restaurant ratings
        const restaurantDoc = await Restaurant.findById(postData.restaurant);
        if (!restaurantDoc) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const newRating = {
            userId: postData.author,
            rating: postData.rating,
            food_rating: postData.food_rating || 0,
            service_rating: postData.service_rating || 0,
            date: new Date()
        };
        
        restaurantDoc.ratings.push(newRating);
        await restaurantDoc.save();

        // Then create the post
        const newPost = await Post.create({
            title: postData.title,
            content: postData.content,
            author: postData.author,
            restaurant: postData.restaurant,
            rating: postData.rating,
            food_rating: postData.food_rating || 0,
            service_rating: postData.service_rating || 0,
            likes: [],
            likeCount: 0,
            comments: []
        });

        res.status(201).json({
            message: "Created Post",
            post: newPost,
            restaurantRating: restaurantDoc.averageRating
        });

    } catch (error) {
        console.error('Error in createPost:', error); // Debug log
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
}
// Post logic
export const getPost = async (req, res) => { //works
    const { id } = req.params;
    try {
        const post = await Post.findById(id); 
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error getting post", error });
    }
}
export const deletePost = async (req, res) => { //works 
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id); 
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted", deletedPost });
    } catch (error) {
        res.status(500).json({ message: "Couldn't delete post", error });
    }
}
// Interactions with post
export const likeOrUnlikePost = async (req, res) => { // works
    console.log("likeOrUnlikePost route hit");
    const { id } = req.params; // Post ID
    const { userId } = req.body;
    console.log("Created");
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Error: Post not found" });
        }
        const hasUserLiked = post.likes.some(like => like.equals(userId));
        if (hasUserLiked) {
            post.likes = post.likes.filter(like => !like.equals(userId));
            post.likeCount -= 1;
            await post.save();
            return res.status(200).json({message: "Post unliked", likeCount: post.likeCount, likes: post.likes});
        } else {
            post.likes.push(userId);
            post.likeCount += 1;
            await post.save();
            return res.status(200).json({message: "Post liked", likeCount: post.likeCount, likes: post.likes});
        }
    } catch (error) {
        console.error("Error in likeOrUnlikePost:", error);
        return res.status(500).json({ message: "Server error", error });
    }
}

export const postComment = async (req, res) => { // works
    const { id } = req.params;
    const { commentText, userId } = req.body;
    console.log(commentText);
    console.log(userId);
    try {
        if (!commentText || !userId) {
            return res.status(400).json({ message: "Comment text and User ID are required" });
        }
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const newComment = {
            userId: new mongoose.Types.ObjectId(userId),
            commentText: commentText, 
            datePosted: new Date(), 
        };

        post.comments.push(newComment);
        await post.save();
        res.status(201).json({
            message: "Comment added successfully",
            newComment,
            totalComments: post.comments.length,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error });
    }
}
// Comment functionality
// Update Comment
export const updateComment = async (req, res) => { // works
    const { id } = req.params;
    const { postId, userId, commentId, commentText } = req.body;

    try {
        //new mongoose.Types.ObjectId(postId)
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) { // no auth
            return res.status(403).json({ message: "User is not authorized to update this comment" });
        }
        comment.commentText = commentText;
        await post.save(); 
        res.status(200).json({
            message: "Comment updated successfully",
            updatedComment: comment
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Error updating comment", error });
    }
}

// Delete Comment
export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { postId, userId, commentId} = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "User is not authorized to update this comment" });
        }
        comment.remove();
        await post.save();
        res.status(200).json({message: "Comment deleted successfully", deletedCommentId: commentId});
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment", error });
    }
  }

export const getPostsForRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ restaurant: id })
            .sort({ createdAt: -1 }); // Sort by newest first
        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }
        
        res.status(200).json({ posts }); // Wrap posts in an object
    } catch (error) {
        console.error('Error in getPostsForRestaurant:', error);
        res.status(500).json({ message: "Error retrieving posts", error: error.message });
    }
}