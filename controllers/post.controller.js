'use strict'

let path = require('path');
let fs = require('fs');
let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');

let Post = require('./../models/post.model');
let User = require('./../models/user.model');
let Follow = require('./../models/follow.model');

function test(req, res) {
    res.status(200).send({message: 'Test From Post Controller'});
}

        /**FUNCTION savePost
        * Permite guardar un Post hecho por el usuario autenticado.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {post}
        */
function savePost(req, res) {
    if(!req.body.text) return res.status(200).send({message: 'You must write a text'});
    let post = new Post();
    post.text = req.body.text;
    post.file = null;
    post.user = req.user.sub;
    post.created_at = moment().unix();

    post.save((err, postSaved) => {
        if(err) return res.status(500).send({message: 'Error while saving post'});
        if(!postSaved) return res.status(404).send({message: 'Post has not been saved'});
        return res.status(200).send({post: postSaved})
    });
}

module.exports = {
    test,
    savePost
}