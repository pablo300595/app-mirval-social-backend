'use strict';
const express = require('express');
const FollowController = require('./../controllers/follow.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');

api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/unfollow/:id', md_auth.ensureAuth, FollowController.deleteFollow);

module.exports = api;