import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    required: [true, 'Caption is required'],
    minLength: [5, 'The caption should be at least 5 characters long']
  },
  description: {
    type: String
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      commentText: {
        type: String,
        required: [true, 'Comments is required'],
        minLength: [1, 'The comment should be at least 1 character long']
      }
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

export const PostModel = mongoose.model('Post', postSchema);
