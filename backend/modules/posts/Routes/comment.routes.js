const express = require("express");
const protect = require("../../../middlewares/token.verification");
const { createComment } = require("../controllers/createComment.controller");
const { getPostComments } = require("../controllers/getPostComments.controller");

const commentRouter = express.Router();

commentRouter.post("/", protect, createComment);
commentRouter.get("/:postId", protect, getPostComments);

module.exports = commentRouter;