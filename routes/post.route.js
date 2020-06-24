'use strict';
const express = require('express');
const PostController = require('./../controllers/post.controller');

const api = express.Router();
const md_auth = require('./../middlewares/authenticated');
const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/posts' });

api.post('/post', md_auth.ensureAuth, PostController.savePost);
api.get('/posts/:page?', md_auth.ensureAuth, PostController.getPosts);
api.get('/post/:id', md_auth.ensureAuth, PostController.getPost);
api.delete('/post/:id', md_auth.ensureAuth, PostController.deletePost);
api.post('/upload-file-post/:id', [md_auth.ensureAuth, md_upload], PostController.uploadFile);
api.get('/get-file-post/:imageFile', md_auth.ensureAuth, PostController.getFile);

module.exports = api;
