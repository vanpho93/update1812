const mongoose = require('mongoose');
const User = require('./User');
const MyError = require('../lib/MyError');
const {
    INVALID_STORY_INFO,
    CANNOT_FIND_USER,
    CANNOT_FIND_STORY
} = require('../lib/ErrorCode');
const { checkObjectIds } = require('../lib/checkObjectIds');

const storySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    title: { type: String },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});

const StoryModel = mongoose.model('Story', storySchema);

class Story extends StoryModel {
    static async addStoryWithUser(idUser, title, content) {
        checkObjectIds([idUser]);
        const story = new Story({ title, content, author: idUser });
        await story.save();
        const user = await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        if (!user) {
            await Story.findByIdAndRemove(story._id);
            throw new MyError('Cannot find user', CANNOT_FIND_USER, 400);
        }
        return story;
    }

    static async removeStory(idUser, idStory) {
        checkObjectIds([idUser, idStory]);
        const story = await Story.findOneAndRemove({ _id: idStory, author: idUser });
        if (!story) throw new MyError('Cannot find story', CANNOT_FIND_STORY, 404);
        const user = await User.findByIdAndUpdate(idUser, { $pull: { stories: idStory } });
        if (!user) throw new MyError('Cannot find user', CANNOT_FIND_USER, 404);
        return story;
    }

    static async likeAStory(idUser, idStory) {
        checkObjectIds([idUser, idStory]);
        const updateObject = { $addToSet: { fans: idUser } };
        const story = await Story.findOneAndUpdate({ _id: idStory, fans: { $nin: [idUser] } }, updateObject, { new: true });
        if (!story) throw new MyError('Cannot find story', CANNOT_FIND_STORY, 404);
        return story;
    }
}

module.exports = Story;

// { _id, fans: [idU1, idU2] }
