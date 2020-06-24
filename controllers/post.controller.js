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

        /**FUNCTION savePost
        * Devuelve las publicaciones de los usuarios que el usuario autenticado sigue.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {post}
        */
function getPosts(req, res) {
    let page = 1;
    let itemsPerPage = 4;
    if(req.params.page) {
        page = req.params.page;
    }

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
        if(err) return res.status(500).send({message: 'Error while retrieving follows'});
        let follows_clean = [];
        follows.forEach(follow => {
            follows_clean.push(follow.followed);
        });
        // Busca cuyo usuario esté contenido en el array follows_clean
        Post.find({user: {$in: follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, posts, total) => {
            if(err) return res.status(500).send({message: 'Error while retrieving posts'});
            if(!posts) return res.status(404).send({message: 'There are not posts'});
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                posts
            })
        })
    });
    
}
        /**FUNCTION savePost
        * Devuelve la publicación especificada por ID.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {post}
        */
function getPost(req, res) {
    let postId = req.params.id;

    Post.findById(postId, (err, post) => {
        if(err) return res.status(500).send({message: 'Error while retrieving post'});
        if(!post) return res.status(404).send({message: 'There are no posts'});
        return res.status(200).send({post});
    });
}

function deletePost(req, res) {
    let postId = req.params.id;

    Post.find({user: req.user.sub, _id: postId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error while deleting post'});
        return res.status(200).send({post: 'Post Removed correctly'});
    });
}

module.exports = {
    test,
    savePost,
    getPosts,
    getPost,
    deletePost
}