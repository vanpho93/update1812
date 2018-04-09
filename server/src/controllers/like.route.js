const express = require('express');
const Story = require('../models/Story');
const Comment = require('../models/Comment');
const mustBeUser = require('./mustBeUser.middleware');
const parser = require('body-parser').json();

const router = express.Router();

router.post('/:idObject', mustBeUser, parser, (req, res) => {
    const { forComment } = req.body;
    if(forComment) {
        return Comment.likeComment(req.idUser, req.params.idObject)
        .then(comment => res.send({ success: true, comment }))
        .catch(error => {
            res
            .status(error.statusCode)
            .send({ success: false, message: error.message, code: error.code });
        })
    }
    Story.likeAStory(req.idUser, req.params.idObject)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res
        .status(error.statusCode ? error.statusCode : 500)
        .send({ success: false, message: error.message, code: error.code });
    })
});

module.exports = router;
