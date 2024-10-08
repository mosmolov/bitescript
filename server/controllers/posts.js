// Feed
export const getPosts = (req, res) => {
    // TODO: database logic to retrieve all posts
    res.status(200).json({ message: "Getting all posts" });
}
export const createPost = (req, res) => {
    const { id } = req.params;
    const post = req.body;

    // TODO: database logic to create a new post
    res.status(201).json({ message: "Created Post: ", post });
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


// Interactions with post
export const likeOrDislikePost = (req, res) => {
    const {id} = req.params;
    const {post, userID} = req.body;
    // TODO: database logic
    res.status(200).json({id});
}

export const postComment = (req, res) => {
    const { id } = req.params;
    const {post, userID} = req.body;
    // TODO: database logic
    res.status(200).json({id});
}

// Comment functionality
export const updateComment = (req, res) => {
    const { id } = req.params;
    const  {post, userID} = req.body;
    // TODO: database logic
    res.status(200).json({id});
}
export const deleteComment = (req, res) => {
    const { id } = req.params;
    const { post, userID } = req.body;
    // TODO: database logic
    res.status(200).json({id});
}