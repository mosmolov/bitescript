// Post logic
export const getPost = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const deletePost = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const getPostLikes = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const getPostComments= (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

// Interactions with post
export const likePost = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const unlikePost = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const postComment = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}

// Comment functionality
export const updateComment = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}
export const deleteComment = (req, res) => {
    const { id } = req.params;
    // TODO: database logic
    res.status(200).json({id});
}