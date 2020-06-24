'use strict';
const express = require('express');
const PostController = require('./../controllers/post.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/posts' });

api.get('/test-post', md_auth.ensureAuth, PostController.test);
api.post('/post', md_auth.ensureAuth, PostController.savePost);
api.get('/posts/:page?', md_auth.ensureAuth, PostController.getPosts);
api.get('/post/:id', md_auth.ensureAuth, PostController.getPost);
api.delete('/post/:id', md_auth.ensureAuth, PostController.deletePost);

module.exports = api;
