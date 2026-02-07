const express = require('express');
const protect = require('../../../middlewares/token.verification');
const { createPost } = require('../controllers/createPost.controller');
const upload = require('../middlewares/postUpload.middleware');
const { getFeed } = require('../controllers/getFeed.controller');
const { toggleLike } = require('../controllers/likePost.controller');
const { updatePost } = require('../controllers/updatePost.controller');
const { deletePost } = require('../controllers/deletePost.controller');

const postRouter = express.Router();

postRouter.post('/',
    protect,
    upload.single("media"),
    createPost,
);
postRouter.get("/feed", protect, getFeed);
postRouter.post("/:postId/like", protect, toggleLike);

postRouter.put("/:id", protect, updatePost);
postRouter.delete("/:id", protect, deletePost);


module.exports = postRouter;