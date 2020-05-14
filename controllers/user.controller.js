'use strict';

const User = require('./../models/user.model');
const bcrypt = require('bcrypt-nodejs');

function home(req, res) {
    res.status(200).send({
        message: 'Home'
    });
}

function test(req, res) {
    res.status(200).send({
        message: 'Test'
    });
}

function saveUser(req, res) {
    let user = new User();

    if(req.body.name && req.body.surname && req.body.nick && req.body.email && req.body.password) {
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.nick = req.body.nick;
        user.email = req.body.email;
        user.password = req.body.password;
        user.role = 'ROLE_USER';
        user.image = null;

        bcrypt.hash(req.body.password, null, null, (err, hash) => {
            user.password = hash;
            user.save((err, userStored) => {
                if(err) return res.status(500).send({message: 'Error while saving user!'});
                if(userStored) {
                    res.status(200).send({user: userStored})
                } else {
                    res.status(404).send({message: `User couldn't be saved`})
                }
            });
        });
    } else {
        res.status(200).send({
            message: 'Please send all required fields!'
        });
    }
}

module.exports = {
    home,
    test,
    saveUser
}