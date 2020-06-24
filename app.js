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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

// Routes
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', post_routes);
app.use('/api', message_routes);
// Export
module.exports = app;