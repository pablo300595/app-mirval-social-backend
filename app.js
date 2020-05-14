'use strict';

const express = require('express');
const bodyParser = require('body-parser');

let app = express();

// Load Routes

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors

// Routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome'
    });
});

app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Prueba'
    });
});
// Export
module.exports = app;