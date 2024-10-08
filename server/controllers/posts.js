// Feed
export const getPosts = (req, res) => {
    // TODO: database logic to retrieve all posts
    res.status(200).json({ message: "Getting all posts" });
}
export const createPost = (req, res) => {
    const { title, content } = req.body;
    // TODO: database logic to create a new post
    res.status(201).json({ message: "Created Post: ", title, content });
}
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