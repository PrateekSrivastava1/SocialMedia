import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import LikeController from "./like.controller.js";

const router = express.Router();

const likeController = new LikeController();

// Routes for Adding and Removing cart items
router.route("/toggle/:id").get(jwtAuth, (req, res) => {
    likeController.toggle(req, res)
});
router.route("/:id").get((req, res) => {
    likeController.getAll(req, res)
});

export default router;
