'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    nick: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: false},
    image: {type: String, required: false}
});

module.exports = mongoose.model('User', UserSchema);