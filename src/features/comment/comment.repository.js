import { ObjectId } from 'mongodb';
import { CommentModel } from './comment.schema.js';

export default class CommentRepository {
  // Repository for creating a comment
  async add(userId, postId, userData) {
    try {
      const newComment = new CommentModel({
        user: new ObjectId(userId),
        post: new ObjectId(postId),
        content: userData.content
      });
      await newComment.save();
      if (newComment) {
        return { success: true, msg: 'Comment added successfully.', comment: newComment };
      } else {
        return { success: false, msg: 'Comment addition failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for updating a comment
  async update(userId, commentId, commentData) {
    try {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: commentId, user: userId },
        { content: commentData.content },
        { new: true }
      );
      if (comment) {
        return { success: true, msg: 'Comment updated successfully.', comment: comment };
      } else {
        return { success: false, msg: 'Comment update failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for deleting a comment
  async delete(commentId, userId) {
    try {
      const comment = await CommentModel.findOneAndDelete({
        _id: commentId,
        user: userId
      });
      if (comment) {
        return { success: true, msg: 'Comment deleted successfully.' };
      }
      return { success: false, msg: 'Comment deletion failed.' };
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for getting all the comments of a post
  async getAll(postId) {
    try {
      const comments = await CommentModel.find({ post: new ObjectId(postId) });
      return comments;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
