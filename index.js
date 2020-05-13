'use strict'

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/app_social', { useNewUrlParser: true, useUnifiedTopology: true }).then( res => {
    console.log('La conexión a la base de datos es correcta');
}).catch( err => {
    console.log(err);
});