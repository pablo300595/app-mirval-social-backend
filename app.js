'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// Load Routes
const user_routes = require('./routes/user.route');
const follow_routes = require('./routes/follow.route');
const post_routes = require('./routes/post.route');
const message_routes = require('./routes/message.route');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// Routes
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', post_routes);
app.use('/api', message_routes);
// Export
module.exports = app;