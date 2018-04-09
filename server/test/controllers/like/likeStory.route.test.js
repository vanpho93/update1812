const assert = require('assert');
const request = require('supertest');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { INVALID_TOKEN, CANNOT_FIND_STORY, INVALID_OBJECT_ID } = require('../../../src/lib/ErrorCode');

describe('POST /like', () => {
    let token1, token2, storyId, idUser2;

    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        await User.signUp('pho2@gmail.com', '123', 'Pho');
        const user1 = await User.signIn('pho1@gmail.com', '123');
        const user2 = await User.signIn('pho2@gmail.com', '123');
        const story = await Story.addStoryWithUser(user1._id, 'JS', 'Javascript');
        await Story.addStoryWithUser(user1._id, 'PHP', 'My SQL');
        token1 = user1.token;
        token2 = user2.token;
        idUser2 = user2._id;
        storyId = story._id;
    });

    it('Can like a story', async () => {
        const response = await request(app)
        .post(`/like/${storyId}`)
        .set({ token: token2 })
        .send({});
        assert.equal(response.status, 200);
        const story = await Story.findById(storyId).populate('fans');
        assert.equal(story.fans.length, 1);
        assert.equal(story.fans[0].email, 'pho2@gmail.com');
    });

    it('Can like a story twice', async () => {
        await Story.likeAStory(idUser2, storyId);
        const response = await request(app)
        .post(`/like/${storyId}`)
        .set({ token: token2 })
        .send({});
        assert.equal(response.body.code, 'CANNOT_FIND_STORY');
    });

    it('Cannot like a story with wrong ObjectID', async () => {
        const response = await request(app)
        .post(`/like/123`)
        .set({ token: token2 })
        .send({});
        assert.equal(response.status, 400);
        assert.equal(response.body.code, INVALID_OBJECT_ID);
        const story = await Story.findById(storyId).populate('fans');
        assert.equal(story.fans.length, 0);
    });

    it('Cannot like a story with wrong ObjectID', async () => {
        const response = await request(app)
        .post(`/like/5a50cdaff08e3716e43bbf46`)
        .set({ token: token2 })
        .send({});
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, CANNOT_FIND_STORY);
        const story = await Story.findById(storyId).populate('fans');
        assert.equal(story.fans.length, 0);
    });
})