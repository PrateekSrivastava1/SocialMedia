import { ObjectId } from 'mongodb';
import { customErrorHandler } from '../../middlewares/errorHandler.js';
import { LikeModel } from './like.schema.js';

export default class LikeRepository {
  // Repository for toggling a like
  async toggle(id, userId, type) {
    try {
      if (type == 'Comment') {
        const commentLike = await LikeModel.findOne({
          comment: new ObjectId(id),
          user: new ObjectId(userId)
        });
        if (!commentLike) {
          const newLike = new LikeModel({ comment: id, user: userId });
          await newLike.save();
          return { success: true, msg: 'Liked the Comment.' };
        } else {
          await LikeModel.deleteOne({
            comment: new ObjectId(id),
            user: new ObjectId(userId)
          });
          return { success: true, msg: 'Un-liked the Comment.' };
        }
      }

      if (type == 'Post') {
        const postLike = await LikeModel.findOne({
          post: new ObjectId(id),
          user: new ObjectId(userId)
        });
        if (!postLike) {
          const newLike = new LikeModel({ post: id, user: userId });
          await newLike.save();
          return { success: true, msg: 'Liked the Post.' };
        } else {
          await LikeModel.deleteOne({
            post: new ObjectId(id),
            user: new ObjectId(userId)
          });
          return { success: true, msg: 'Un-liked the Post.' };
        }
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for fetching all the likes
  async getAll(id) {
    try {
      const commentLikes = await LikeModel.find({ comment: new ObjectId(id) });
      if (commentLikes) {
        return { success: true, msg: 'All comment likes', likes: commentLikes };
      }

      const postLikes = await LikeModel.find({ post: new ObjectId(id) });
      if (postLikes) {
        return { success: true, msg: 'All post likes', likes: postLikes };
      }
      return { success: false, msg: 'Failed to fetch likes' };
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
