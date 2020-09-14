'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// Load Routes
const USER_ROUTES = require('./routes/user.route');
const FOLLOW_ROUTES = require('./routes/follow.route');
const POST_ROUTES = require('./routes/post.route');
const MESSAGE_ROUTES = require('./routes/message.route');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routes
app.use('/api', USER_ROUTES);
app.use('/api', FOLLOW_ROUTES);
app.use('/api', POST_ROUTES);
app.use('/api', MESSAGE_ROUTES);
// Export
module.exports = app;