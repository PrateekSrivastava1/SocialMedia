import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  content: {
    type: String,
    required: true,
    minLength: [3, 'Comment should be at least 3 characters long']
  }
});

export const CommentModel = mongoose.model('Comment', commentSchema);
