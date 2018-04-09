const express = require('express');
const cors = require('cors');
const storyRoute = require('./controllers/story.route');
const userRoute = require('./controllers/user.route');
const likeRoute = require('./controllers/like.route');
const commentRoute = require('./controllers/comment.route');
const friendRoute = require('./controllers/friend.route');
const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Server is running'));
app.use('/story', storyRoute);
app.use('/user', userRoute);
app.use('/like', likeRoute);
app.use('/comment', commentRoute);
app.use('/friend', friendRoute);

module.exports = app;
