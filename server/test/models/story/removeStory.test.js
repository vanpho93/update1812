const assert = require('assert');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');

describe('Test remove story', () => {
    let idUser;
    let idStory;

    beforeEach('Create a user for test', async () => {
        const user = await User.signUp('pho@gmail.com', '123', 'Pho');
        idUser = user._id;
        const story = await Story.addStoryWithUser(idUser, 'JS', 'Javascript');
        await Story.addStoryWithUser(idUser, 'JS1', 'Javascript1');
        idStory = story._id;
    });

    it('Can remove story with story id', async () => {
        await Story.findByIdAndRemove(idStory);
        await User.findByIdAndUpdate(idUser, { $pull: { stories: idStory } });    
        // const user = await User.findById(idUser);
        const user = await User.findById(idUser).populate('stories');
        assert.equal(user.stories.length, 1);
        assert.equal(user.stories[0].title, 'JS1');
    });
});
