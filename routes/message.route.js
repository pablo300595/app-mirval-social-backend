'use strict';
const express = require('express');
const MessageController = require('./../controllers/message.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');

api.get('/test-message', md_auth.ensureAuth, MessageController.test);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/messages-received/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages-sent/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/messages-unseen', md_auth.ensureAuth, MessageController.getUnseenMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);


module.exports = api;