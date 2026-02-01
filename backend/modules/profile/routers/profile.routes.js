const express = require('express');
const protect = require('../../../middlewares/token.verification');
const { getProfileByUserId } = require('../controllers/getProfileByUserId.controller');
const { updateMyProfile } = require('../controllers/updateMyProfile.controller');
const { toggleVisibility } = require('../controllers/toggleVisibility.controller');
const { getMyProfile } = require('../controllers/getMyProfile.controller');

const profileRouters = express.Router();

profileRouters.get("/me", protect, getMyProfile);
profileRouters.put("/", protect, updateMyProfile);
profileRouters.patch("/visibility", protect, toggleVisibility);
profileRouters.get("/:userId", getProfileByUserId);

module.exports = profileRouters;