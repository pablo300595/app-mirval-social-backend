'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'secret_key';

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({message: `Request doesn't have auth headers`});
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    let payload;
    try {
        payload = jwt.decode(token, secret);
        if(payload.exp <= moment.unix()) {
            return res.status(401).send({message: 'Token has expired'});
        }
    } catch(ex) {
        return res.status(404).send({message: 'Invalid Token'});
    }

    req.user = payload;
    next();
}