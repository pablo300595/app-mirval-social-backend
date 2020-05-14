'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = '3800';

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/app_social', { useNewUrlParser: true, useUnifiedTopology: true }).then( res => {
    console.log('La conexión a la base de datos es correcta');
    app.listen(port, res => {
        console.log('Server running at port '+ port);
    })
}).catch( err => {
    console.log(err);
});