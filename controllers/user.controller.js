'use strict';

const User = require('./../models/user.model');
const Follow = require('./../models/follow.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./../services/jwt');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

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
    
    Promise.all([
        User.findById(userId), 
        Follow.findOne({"user": req.user.sub, "followed": userId}),
        Follow.findOne({"user": userId, "followed": req.user.sub})
    ])
    .then(value => {
        console.log(value[0].constructor.modelName)
        console.log(value[1].constructor.modelName)
        res.status(200).send({user: value[0], following: value[1], followed: value[2]});
    }).catch(err => {
        return res.status(500).send({message: err});
    });
}

function getUsers(req, res) {
    const identity_user_id = req.user.sub;
    let page = 1;
    let itemsPerPage = 5;

    if(req.params.page) {
        page = req.params.page;
    }

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Error in the request'});
        if(!users) return res.status(404).send({message: 'No Users Found'});
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });

}

function updateUser(req, res) {
    const userId = req.params.id;
    let user = req.body;
    delete user.password;

    if(userId != req.user.sub) {
        return res.status(500).send({message: 'You are not allowed to update user data'});
    }

    User.findByIdAndUpdate(userId, user, {new: true}, (err, updatedUser) => {
        if(err) return res.status(500).send({message: 'Erro in the request'});
        if(!updateUser) return res.status(404).send({message: 'User not updated'});
        return res.status(200).send({user: updatedUser});
    })
}

function uploadImage(req, res) { 
    let userId = req.params.id;
    
    if(req.files) {
        const file_path = req.files.image.path;
        const file_split = file_path.split('/');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(userId != req.user.sub) {
            return removeFiles(res, file_path, 'You are not allowed to update the avatar Image');
        }
    

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            // Update user avater if file extension is correct
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if(err) return res.status(500).send({message: 'Error in the request'});

                if(!userUpdated) return res.status(404).send({message: `User couldn't been updated`});

                return res.status(200).send({user: userUpdated});
            });
        } else {
            return removeFiles(res, file_path, 'Invalid Extension');
        }
    } else {
        return res.status(200).send({message: `File haven't been uploaded`});
    }
}

function getImageFile(req, res) { 
    const imageFile = req.params.imageFile;
    const pathFile = './uploads/users/'+imageFile;
    fs.exists(pathFile, (exist) => {
        if(exist) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: `Image doesn't exist`});
        }
    });
}

function removeFiles(res, file_path, message){ 
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message, error: err});
    });
}

module.exports = {
    home,
    test,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}