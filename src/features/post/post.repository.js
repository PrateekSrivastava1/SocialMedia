import { ObjectId } from 'mongodb';

import { customErrorHandler } from '../../middlewares/errorHandler.js';
import { PostModel } from './post.schema.js';

export default class PostRepository {
  // Add a new post
  async newPost(userId, userData) {
    try {
      const newPost = new PostModel({
        caption: userData.caption,
        description: userData.description,
        user: userId,
        comments: [],
        likes: []
      });
      await newPost.save();
      if (newPost)
        return { success: true, msg: 'Post added successfully', details: newPost };
      else return { success: false, msg: 'Post not added' };
    } catch (err) {
      console.log(err);
      if (err.name === 'ValidationError') {
        let errors = [];
        Object.keys(err.errors).forEach(key => {
          errors.push(err.errors[key].message);
        });
        return { success: false, msg: errors };
      }
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Fetch all the post
  async getAllPost() {
    try {
      const posts = await PostModel.find();
      return posts;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for fecthing a post
  async getOnePost(id) {
    try {
      const post = await PostModel.findOne({ _id: new ObjectId(id) });
      return post;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for fetching user's all the posts
  async usersPost(userId) {
    try {
      const post = await PostModel.find({ user: new ObjectId(userId) });
      return post;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for updating a post
  async updatePost(userData, postId, userId) {
    try {
      const post = await PostModel.findOneAndUpdate(
        { _id: new ObjectId(postId), user: new ObjectId(userId) },
        { caption: userData.caption },
        { description: userData.description },
        { new: true }
      );
      return post;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for deleting a post
  async deletePost(postId, userId) {
    try {
      const post = await PostModel.deleteOne({
        _id: new ObjectId(postId),
        user: new ObjectId(userId)
      });
      return post;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
