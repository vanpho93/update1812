const express = require('express');
const Comment = require('../models/Comment');
const mustBeUser = require('./mustBeUser.middleware');
const parser = require('body-parser').json();
const router = express.Router();

router.post('/', mustBeUser, parser, (req, res) => {
    const { storyId, content } = req.body;
    Comment.createComment(req.idUser, storyId, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

router.delete('/:idComment', mustBeUser, (req, res) => {
    Comment.removeComment(req.idUser, req.params.idComment)
    .then(comment => res.send({ success: true, comment }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

module.exports = router;
