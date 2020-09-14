'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const dbConfig = require('./config/db.config');
const serverConfig = require('./config/server.config');


// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.URI, dbConfig.DEFAULT_OPTIONS).then( res => {
    console.log(dbConfig.DBCONNECTION_RUNNING_SUCESS);
    app.listen(serverConfig.PORT, () => {
        console.log(serverConfig.SERVER_RUNNING_SUCESS + serverConfig.PORT);
    })
}).catch( err => {
    console.log(err);
});