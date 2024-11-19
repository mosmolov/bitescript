import User from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ message: "Success", user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, username, firstName, lastName, picture } = req.body;

    const updatedFields = {};
    if (password) updatedFields.password = password;
    if (username) updatedFields.username = username;
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (picture) updatedFields.picture = picture;

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { id: loggedInUserId } = req.body;

    if (!targetUserId || !loggedInUserId) {
      return res.status(400).json({ message: "Missing required IDs" });
    }

    const userToFollow = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToFollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (userToFollow.followers.includes(loggedInUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Update both users
    const updatedUserToFollow = await User.findByIdAndUpdate(
      targetUserId,
      {
        $addToSet: { followers: loggedInUserId }
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $addToSet: { following: targetUserId }
      },
      { new: true }
    );

    res.status(200).json({
      message: "Followed successfully",
      user: updatedUserToFollow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id; // ID of user to unfollow
    const { id: loggedInUserId } = req.body; // Fix: properly destructure from body

    if (!targetUserId || !loggedInUserId) {
      return res.status(400).json({ message: "Missing required IDs" });
    }

    const userToUnfollow = await User.findById(targetUserId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToUnfollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if not following
    if (!userToUnfollow.followers.includes(loggedInUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Update both users
    const updatedUserToUnfollow = await User.findByIdAndUpdate(
      targetUserId,
      {
        $pull: { followers: loggedInUserId }
      },
      { new: true }
    );

    const updatedLoggedInUser = await User.findByIdAndUpdate(
      loggedInUserId,
      {
        $pull: { following: targetUserId }
      },
      { new: true }
    );

    res.status(200).json({
      message: "Unfollowed successfully",
      user: updatedUserToUnfollow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFeed = (req, res) => {
  const { id } = req.params;
  // TODO: database logic -> getPosts and then filter with userId
  res.status(200).json({ id });
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username firstName lastName picture followers')
    .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
