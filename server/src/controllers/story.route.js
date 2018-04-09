const express = require('express');
const parser = require('body-parser').json();
const Story = require('../models/Story');
const mustBeUser = require('./mustBeUser.middleware');

const router = express.Router();

router.get('/', (req, res) => {
    Story.find({}).populate('author', 'name').populate({ path: 'comments', populate: { path: 'user', select: 'name' } }).limit(30)
    .then(stories => res.send({ success: true, stories }));
});

router.get('/:id', (req, res) => {
    Story.findById(req.params.id)
    .then(story => {
        if (!story) return res.status(404).send({
            success: false,
            message: 'Cannot find story'
        });
        res.send({ success: true, story });
    })
    .catch(error => res.status(404).send({ success: false, error: error.message }));
});

router.post('/', mustBeUser, parser, (req, res) => {
    const { content, title } = req.body;
    Story.addStoryWithUser(req.idUser, title, content)
    .then(newStory => res.send({ success: true, story: newStory }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

router.delete('/:id', mustBeUser, (req, res) => {
    Story.removeStory(req.idUser, req.params.id)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res
        .status(error.statusCode)
        .send({ success: false, message: error.message, code: error.code });
    });
});

module.exports = router;
