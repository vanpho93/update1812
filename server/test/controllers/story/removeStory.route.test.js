const assert = require('assert');
const request = require('supertest');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { INVALID_TOKEN, CANNOT_FIND_STORY, INVALID_OBJECT_ID } = require('../../../src/lib/ErrorCode');

describe('Test DELETE /story:id', () => {
    let token1, token2, storyId;
    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        await User.signUp('pho2@gmail.com', '123', 'Pho');
        const user1 = await User.signIn('pho1@gmail.com', '123');
        const user2 = await User.signIn('pho2@gmail.com', '123');
        const story = await Story.addStoryWithUser(user1._id, 'JS', 'Javascript');
        await Story.addStoryWithUser(user1._id, 'PHP', 'My SQL');
        token1 = user1.token;
        token2 = user2.token;
        storyId = story._id;
    });

    it('Can remove story with id', async () => {
        const { status, body } = await request(app)
        .delete(`/story/${storyId}`)
        .set({ token: token1 });
        assert.equal(status, 200);
        assert.equal(body.success, true);
        assert.equal(body.story.title, 'JS');
        const stories = await Story.find({});
        assert.equal(stories[0].title, 'PHP');
        assert.equal(stories.length, 1);
    });

    it('Cannot remove story with wrong token', async () => {
        const { status, body } = await request(app)
        .delete(`/story/${storyId}`)
        .set({ token: 'ascdgahsbd' });
        assert.equal(status, 400);
        assert.equal(body.success, false);
        assert.equal(body.code, INVALID_TOKEN)
        const stories = await Story.find({});
        assert.equal(stories.length, 2);
    });

    it('Cannot remove story with other token', async () => {
        const { status, body } = await request(app)
        .delete(`/story/${storyId}`)
        .set({ token: token2 });
        assert.equal(status, 404);
        assert.equal(body.success, false);
        assert.equal(body.code, CANNOT_FIND_STORY);
        const stories = await Story.find({});
        assert.equal(stories.length, 2);
    });

    it('Cannot remove story with invalid story id', async () => {
        const { status, body } = await request(app)
        .delete(`/story/${storyId}x`)
        .set({ token: token2 });
        assert.equal(status, 400);
        assert.equal(body.success, false);
        assert.equal(body.code, INVALID_OBJECT_ID);
        const stories = await Story.find({});
        assert.equal(stories.length, 2);
    });
});
