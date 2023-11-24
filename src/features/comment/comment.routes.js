import express from 'express';
import CommentController from './comment.controller.js';

const router = express.Router();

const commentController = new CommentController();

// Defined routes for different comment actions and linked them to respective controller methods

router.route('/:postId').post((req, res) => {
  commentController.add(req, res);
});
router.route('/:commentId').put((req, res) => {
  commentController.update(req, res);
});
router.route('/:commentId').delete((req, res) => {
  commentController.delete(req, res);
});
router.route('/:postId').get((req, res) => {
  commentController.getAll(req, res);
});

export default router;
