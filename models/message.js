'use strict';

const mongoose = require('mongose');
const Schema = mongoose.Schema;

MessageSchema = Schema({
    emitter: { type: Schema.ObjectId, ref: 'User'},
    receiver: { type: Schema.ObjectId, ref: 'User'},
    text: String,
    created_at: String
});

module.exports = mongoose.model('Message', MessageSchema);