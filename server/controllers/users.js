import User from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, username, firstName, lastName, picture } = req.body;

        const updatedFields = {}
        if (password) updatedFields.password = password;
        if (username) updatedFields.username = username;
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (picture) updatedFields.picture = picture;

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {new: true})

        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
}

export const followUser = async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: update once auth is done
        const loggedInUserId = "12345";

        const userToFollow = await User.findById(id);
        const loggedInUser = await User.findById(loggedInUserId);

        await User.findByIdAndUpdate(id, {followers: [loggedInUserId, ...userToFollow.followers]});
        await User.findByIdAndUpdate(loggedInUserId, {following: [id, ...loggedInUser.following]});

        res.status(200);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
}

export const unfollowUser = async (req, res) => {
    const { id } = req.params;
    // TODO: update once auth is done
    const loggedInUserId = "12345";

    const userToUnfollow = await User.findById(id);
    const loggedInUser = await User.findById(loggedInUserId);

    await User.findByIdAndUpdate(id, {followers: [userToUnfollow.followers.filter(follower => follower !== loggedInUserId)]});
    await User.findByIdAndUpdate(loggedInUserId, {following: [loggedInUser.following.filter(following => following !== id)]});

    res.status(200);
}

export const getUserFeed = (req, res) => {
    const { id } = req.params;
    // TODO: database logic -> getPosts and then filter with userId
    res.status(200).json({id});
}