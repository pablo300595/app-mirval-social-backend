'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// Load Routes
const user_routes = require('./routes/user.route');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// Routes
app.use('/api', user_routes);
// Export
module.exports = app;