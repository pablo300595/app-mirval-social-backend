'use strict';
const express = require('express');
const MessageController = require('./../controllers/message.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');

api.get('/test-message', md_auth.ensureAuth, MessageController.test);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessage);


module.exports = api;