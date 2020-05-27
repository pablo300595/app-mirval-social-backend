'use strict';

const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('./../models/user.model');
const Follow = require('./../models/follow.model');

function saveFollow(req, res) { 
    const follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = req.body.followed;
    follow.save((err, followStored) => {
        if(err) return res.status(500).send({message: 'Error while saving follow'});
        if(!followStored) return res.status(404).send({message: `Follow couldn't be saved`});
        return res.status(200).send({follow: followStored});
    });
}

function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;
    Follow.find({user: userId, followed: followId}).remove(err => {
        if(err) return res.status(500).send({message: 'Error while unfollow'});
        return res.status(200).send({message: 'User unfollow'});
    });
}

function getFollowingUsers(req, res) { 
    let userId = req.user.sub;
    let page = 1;
    let itemsPerPage = 2;

    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if(req.params.page) {
        page = req.params.page;
    }

    Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error in the server'});
        if(!follows) return res.status(404).send({message: `There's no follows`});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

function getFollowedUsers(req, res){ 
    let userId = req.user.sub;
    let page = 1;
    let itemsPerPage = 2;

    if(req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if(req.params.page) {
        page = req.params.page;
    }

    Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if(err) return res.status(500).send({message: 'Error in the server'});
        if(!follows) return res.status(404).send({message: `There's no follows`});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        });
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}