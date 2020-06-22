'use strict';

const express = require('express');
const UserController = require('./../controllers/user.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/users'});

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', md_auth.ensureAuth, UserController.getImageFile);
api.get('/get-follow-stadistics', md_auth.ensureAuth, UserController.getFollowStadistics);


module.exports = api;