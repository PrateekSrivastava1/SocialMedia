import { customErrorHandler } from '../../middlewares/errorHandler.js';
import PostRepository from './post.repository.js';

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  //  adding a post
  async newPost(req, res, next) {
    try {
      const userId = req.cookies.userId;
      const post = await this.postRepository.newPost(userId, req.body);
      if (post.success)
        res.status(201).json({ success: true, msg: post.msg, post: post.details });
      else res.status(400).json({ success: false, msg: post.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  //  fetching all post
  async getAllPost(req, res, next) {
    try {
      const posts = await this.postRepository.getAllPost();
      if (posts) res.json({ success: true, posts });
      else res.json({ success: false, msg: 'Could not find posts' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  //  fetching one post
  async getOnePost(req, res, next) {
    try {
      const post = await this.postRepository.getOnePost(req.params.postId);
      if (post) res.json({ success: true, post });
      else res.json({ success: false, msg: 'Could not find post' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  //  displaying user specific posts
  async usersPost(req, res, next) {
    try {
      const posts = await this.postRepository.usersPost(req.cookies.userId);
      if (posts) res.json({ success: true, posts });
      else res.json({ success: false, msg: 'No posts found' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  //  updating a post
  async updatePost(req, res, next) {
    try {
      const postId = req.params.postId;
      const post = await this.postRepository.updatePost(
        req.body,
        postId,
        req.cookies.userId
      );
      if (post) res.json({ success: true, msg: 'Post updated successfully', post });
      else res.json({ success: false, msg: 'Post not updated' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  //  deleting a post
  async deletePost(req, res, next) {
    const postId = req.params.postId;
    const post = await this.postRepository.deletePost(postId, req.cookies.userId);
    if (post) res.json({ success: true, msg: 'Post deleted successfully', post });
    else res.json({ success: false, msg: 'Post not deleted' });
  }
}
