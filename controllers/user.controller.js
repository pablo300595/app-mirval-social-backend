'use strict';

const User = require('./../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./../services/jwt');

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
        // Check if the user to register exists in the DB
        User.find({$or: [
            {email: user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()} 
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({message: 'Error while saving user!'});
            if(users && users.length >= 1) {
                return res.status(200).send({message: 'The User already exists!'});
            } else {
                // Encode Password and Store User
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

            }
        });
        
    } else {
        res.status(200).send({
            message: 'Please send all required fields!'
        });
    }
}

function loginUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({email: email}, (err, user)=> {
        if(err) return res.status(500).send({message: 'Error at request!'});
        if(user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if(check) {
                    
                    if(req.body.gettoken) {
                        //generate and return token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // return user data
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                } else {
                    return res.status(404).send({message: `User doesn't exist!`});
                }
            });
        } else {
            return res.status(404).send({message: `User doesn't exist!`});
        }
    });
}

function getUser(req, res) {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message: 'Error in the request'});
        if(!user) return res.status(404).send({message: `User doesn't exist`});
        return res.status(200).send({user});
    });
}

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser
}