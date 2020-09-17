'use strict'

let path = require('path');
let fs = require('fs');
let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');

let Post = require('./../models/post.model');
let User = require('./../models/user.model');
let Follow = require('./../models/follow.model');

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
        /**FUNCTION getPosts
        * Devuelve las publicaciones de los usuarios que el usuario autenticado sigue.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {total_items, pages, page, posts[]}
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
        follows_clean.push(req.user.sub);
        // Busca cuyo usuario esté contenido en el array follows_clean
        Post.find({user: {$in: follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, posts, total) => {
            if(err) return res.status(500).send({message: 'Error while retrieving posts'});
            if(!posts) return res.status(404).send({message: 'There are not posts'});
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                posts
            })
        })
    });
    
}
        /**FUNCTION getPost
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
        /**FUNCTION deletePost
        * Devuelve la publicación especificada por ID.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {message}
        */
function deletePost(req, res) {
    let postId = req.params.id;

    Post.find({user: req.user.sub, _id: postId}).remove((err) => {
        if(err) return res.status(500).send({message: 'Error while deleting post'});
        return res.status(200).send({message: 'Post Removed correctly'});
    });
}
        /**FUNCTION uploadFile
        * Permite que el usuario autenticado actualice el archivo de su post. 
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON} {post}
        */
function uploadFile(req, res) {
    let postId = req.params.id;

    if(req.files) {
        const file_path = req.files.file.path;
        const file_split = file_path.split('/');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            
            Post.find({user: req.user.sub, _id: postId}).exec((err, post) => {
                if(post.length!=0) {
                    // Update user post if extension is correct
                    Post.findByIdAndUpdate(postId, {file: file_name}, {new: true}, (err, postUpdated) => {
                        if(err) return res.status(500).send({message: 'Error in the request'});
                        if(!postUpdated) return res.status(404).send({message: `User couldn't been updated`});
                        return res.status(200).send({post: postUpdated});
                    });
                } else {
                    return removeFiles(res, file_path, 'Not allowed to update this post');
                }
            });
                
        } else {
            return removeFiles(res, file_path, 'Invalid Extension');
        }
    } else {
        return res.status(200).send({message: `File haven't been uploaded`});
    }
}
        /**__Auxiliar uploadFile Functions
        * Elimina archivos cuando un usuario no autorizado trata de subir una imágen.
        * @param {Response} res Respuesta HTTP.
        * @param {String} file_path Ruta de archivo.
        * @param {String} message Mensaje personalizado.
        * @return {JSON} {message, error}
        */
function removeFiles(res, file_path, message){ 
        fs.unlink(file_path, (err) => {
            return res.status(200).send({message: message, error: err});
        });
}
        /**FUNCTION getImageFile
        * Le permite al usuario autenticado obtener el archivo de su post. 
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {File} Archivo de Post
        */
function getFile(req, res) { 
    const imageFile = req.params.imageFile;
    const pathFile = './uploads/posts/'+imageFile;
    fs.exists(pathFile, (exist) => {
        if(exist) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({message: `Image doesn't exist`});
        }
    });
}
module.exports = {
    savePost,
    getPosts,
    getPost,
    deletePost,
    uploadFile,
    getFile
}