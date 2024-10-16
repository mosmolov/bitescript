import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Assuming this is a unique identifier
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^.+@.+\..+$/, 'Please fill a valid email address'] // Simple regex to validate email format
  },
  password: {
    type: String,
    required: true,
    // Assuming passwords are hashed before being saved
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    // Assuming it will be a URL or file path
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other users' IDs in the same collection
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other users' IDs in the same collection
    }
  ],
  createdTimestamp: {
    type: Number,
    default: Date.now, // Set default to current timestamp
  }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
