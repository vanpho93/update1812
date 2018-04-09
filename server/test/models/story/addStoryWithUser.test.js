const assert = require('assert');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');

describe('Test add new story with user', () => {
    let _id;
    beforeEach('Create a user for test', async () => {
        const user = await User.signUp('pho1@gmail.com', '123', 'Pho');
        _id = user._id;
    });

    it('Can add story for a user', async () => {
        const story = new Story({ title: 'JS', content: 'Javascript', author: _id });
        await story.save();
        const story2 = await Story.findOne({}).populate('author');
        assert.equal(story2.author.name, 'Pho');
        await User.findByIdAndUpdate(_id, { $push: { stories: story._id } });
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].title, 'JS');
    });

    it('Can add story for user using static method', async () => {
        await Story.addStoryWithUser(_id, 'JS', 'Javascript');
        const story = await Story.findOne({}).populate('author');
        assert.equal(story.author.name, 'Pho');
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].title, 'JS');
    });
});
