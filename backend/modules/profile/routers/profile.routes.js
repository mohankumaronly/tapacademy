const express = require('express');
const protect = require('../../../middlewares/token.verification');
const { getProfileByUserId } = require('../controllers/getProfileByUserId.controller');
const { updateMyProfile } = require('../controllers/updateMyProfile.controller');
const { toggleVisibility } = require('../controllers/toggleVisibility.controller');
const { getMyProfile } = require('../controllers/getMyProfile.controller');
const { uploadAvatar } = require('../controllers/uploadAvatar.controller');
const upload = require('../middlewares/upload.middleware');
const { getPublicProfiles } = require('../controllers/getPublicProfiles.controller');
const { toggleFollow } = require('../controllers/toggleFollow.controller');
const { getFollowStats } = require('../controllers/getFollowStats.controller');
const { getFollowers } = require('../controllers/getFollowers.controller');
const { getFollowing } = require('../controllers/getFollowing.controller');

const profileRouters = express.Router();

profileRouters.get("/me", protect, getMyProfile);
profileRouters.put("/", protect, updateMyProfile);
profileRouters.patch("/visibility", protect, toggleVisibility);
profileRouters.get("/public", getPublicProfiles);
profileRouters.get("/:userId", getProfileByUserId);
profileRouters.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);
profileRouters.post("/follow/:userId", protect, toggleFollow);
profileRouters.get("/follow-stats/:userId", protect, getFollowStats);
profileRouters.get("/followers/:userId", protect, getFollowers);
profileRouters.get("/following/:userId", protect, getFollowing);

module.exports = profileRouters;