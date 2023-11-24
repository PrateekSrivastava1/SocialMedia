import { customErrorHandler } from '../../middlewares/errorHandler.js';
import LikeRepository from './like.repository.js';

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  // toggling the like
  async toggle(req, res) {
    try {
      const id = req.params.id;
      const userId = req.cookies.userId;
      const type = req.query.type;
      const like = await this.likeRepository.toggle(id, userId, type);
      if (like.success) {
        return res.json({ success: true, msg: like.msg });
      }
      return res.json({ success: false, msg: 'Failed to like/unlike Post' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // fetching all the likes
  async getAll(req, res) {
    try {
      const id = req.params.id;
      const allLikes = await this.likeRepository.getAll(id);
      if (allLikes.success) {
        return res.json({ msg: allLikes.msg, likes: allLikes.likes });
      }
      return res.json({ success: false, msg: allLikes.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
