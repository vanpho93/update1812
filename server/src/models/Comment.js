const mongoose = require('mongoose');
const User = require('./User');
const Story = require('./Story');
const { checkObjectIds } = require('../lib/checkObjectIds');
const MyError = require('../lib/MyError');
const { CANNOT_FIND_STORY, INVALID_COMMENT, CANNOT_FIND_COMMENT } = require('../lib/ErrorCode');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    content: { type: String, required: true },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const CommentModel = mongoose.model('Comment', commentSchema);

class Comment extends CommentModel {
    static async createComment(idUser, idStory, content) {
        checkObjectIds([idUser, idStory]);
        const story = await Story.findById(idStory);
        if (!story) throw new MyError('Cannot find story', CANNOT_FIND_STORY, 404);
        if (!content) throw new MyError('Invalid comment', INVALID_COMMENT, 401);
        const comment = new Comment({ user: idUser, content, story: idStory });
        await comment.save();
        const updateObject = { $push: { comments: comment._id } };
        await Story.findByIdAndUpdate(idStory, updateObject);
        return Comment.populate(comment, { path: 'user', select: 'name' });
    }

    static async removeComment(idUser, idComment) {
        checkObjectIds([idUser, idComment]);
        const comment = await Comment.findOneAndRemove({ _id: idComment, user: idUser });
        if (!comment) throw new MyError('Cannot find comment.', CANNOT_FIND_COMMENT, 404);
        const { _id, story } = comment;
        await Story.findByIdAndUpdate(story, { $pull: { comments: _id } });
        return comment;
    }

    static async likeComment(idUser, idComment) {
        checkObjectIds([idUser, idComment]);
        const updateObject = { $addToSet: { fans: idUser } };
        const comment = await Comment.findByIdAndUpdate(idComment, updateObject, { new: true });
        if (!comment) throw new MyError('Cannot find comment.', CANNOT_FIND_COMMENT, 404);
        return comment;
    }
}

module.exports = Comment;
