const express = require('express');
const parser = require('body-parser').json();
const { hash, compare } = require('bcrypt');
const User = require('../models/User');

const userRoute = express.Router();

userRoute.post('/signup', parser, (req, res) => {
    const { email, password, name } = req.body;
    User.signUp(email, password, name)
    .then(user => res.send({ success: true, user }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

userRoute.post('/signin', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

userRoute.post('/check', (req, res) => {
    User.check(req.headers.token)
    .then(user => res.send({ success: true, user }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

module.exports = userRoute;
