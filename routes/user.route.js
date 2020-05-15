'use strict';

const express = require('express');
const UserController = require('./../controllers/user.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');

api.get('/home', UserController.home);
api.get('/test', md_auth.ensureAuth, UserController.test);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;