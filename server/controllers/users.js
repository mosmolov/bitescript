export const getUser = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    // NOTE: might conflict with auth team
    res.status(200).json({id});
}

export const updateUser = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const getUserPosts = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const followUser = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const unfollowUser = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const getUserFollowers = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const getUserFollowing = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

export const getUserFeed = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}