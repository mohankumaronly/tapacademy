const express = require('express');
const protect = require('../../../middlewares/token.verification');
const { createPost } = require('../controllers/createPost.controller');
const upload = require('../middlewares/postUpload.middleware');

const postRouter = express.Router();

postRouter.post('/',
    protect,
     upload.single("media"),
    createPost,

)

module.exports = postRouter;