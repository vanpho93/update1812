const express = require('express');
const parser = require('body-parser').json();
const User = require('../models/User');
const mustBeUser = require('./mustBeUser.middleware');

const friendRoute = express.Router();
friendRoute.use(mustBeUser)

friendRoute.get('/', (req, res) => {
    User.getUsers(req.idUser)
    .then(users => res.send({ success: true, users }))
    .catch(error => {
        console.log(error);
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

friendRoute.post('/request', parser, (req, res) => {
    User.addFriend(req.idUser, req.body.idFriend)
    .then(friend => res.send({ success: true, friend }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

friendRoute.post('/accept', parser, (req, res) => {
    User.acceptFriend(req.idUser, req.body.idFriend)
    .then(friend => res.send({ success: true, friend }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

friendRoute.delete('/:idFriend', (req, res) => {
    User.removeFriend(req.idUser, req.params.idFriend)
    .then(friend => res.send({ success: true, friend }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

module.exports = friendRoute;
