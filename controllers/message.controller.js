'use strict'

const moment = require('moment');
const mongoosePaginate = require('mongoose-pagination');

const User = require('./../models/user.model');
const Follow = require('./../models/follow.model');
const Message = require('./../models/message.model');

function test(req, res) {
    res.status(200).send({
        message: 'Test Message Controller'
    });
}

        /**FUNCTION saveMessage
        * Permite almacenar un mensaje en la Base de Datos al usuario autenticado.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON}  {message}
        */
function saveMessage(req, res) {
    if(!req.body.text || !req.body.receiver) return res.status(200).send({message: 'Please send all field'});
    let message = new Message();

    message.emitter = req.user.sub;
    message.receiver = req.body.receiver;
    message.text = req.body.text;
    message.created_at = moment().unix();
    message.viewed = false;
    
    message.save((err, messageStored) => {
        if(err) return res.status(500).send({message: 'Error at request'});
        if(!messageStored) return res.status(404).send({message: 'Error while sending message'});
        return res.status(200).send({message: messageStored});
    });
}

        /**FUNCTION getReceivedMessage
        * Permite obtener los mensajes del usuario autenticado.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON}  {total, pages, messages}
        */
function getReceivedMessages(req, res) {
    let page = 1;
    const itemsPerPage = 4;

    if(req.params.page) page = req.params.page;
    
    Message.find({receiver: req.user.sub}).populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error at request'});
        if(!messages) return res.status(404).send({message: 'No messages'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

        /**FUNCTION getEmittedMessages
        * Permite obtener los mensajes enviados por el usuario autenticado.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON}  {total, pages, messages}
        */
function getEmittedMessages(req, res) {
    let page = 1;
    const itemsPerPage = 4;

    if(req.params.page) page = req.params.page;
    
    Message.find({emitter: req.user.sub}).populate('emitter receiver', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if(err) return res.status(500).send({message: 'Error at request'});
        if(!messages) return res.status(404).send({message: 'No messages'});
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    });
}

        /**FUNCTION getUnseenMessages
        * Permite obtener el conteo de los mensajes no vistos por el usuario autenticado.
        * @param {Request} req Petición HTTP
        * @param {Response} res Respuesta HTTP
        * @return {JSON}  {unviewed}
        */
function getUnseenMessages(req, res) {
    Message.count({receiver: req.user.sub, viewed: false}).exec((err, count) => {
        if(err) return res.status(500).send({message: 'Error at request'});
        return res.status(200).send({unviewed: count});
    });
}

module.exports = {
    test,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnseenMessages
}