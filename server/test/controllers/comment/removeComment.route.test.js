const assert = require('assert');
const request = require('supertest');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');
const Comment = require('../../../src/models/Comment');
const app = require('../../../src/app');
const { INVALID_TOKEN, CANNOT_FIND_STORY, INVALID_OBJECT_ID, INVALID_COMMENT, CANNOT_FIND_COMMENT } = require('../../../src/lib/ErrorCode');

describe('DELETE /comment/:id', () => {
    let token1, token2, storyId, commentId;

    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        await User.signUp('pho2@gmail.com', '123', 'Pho 2');
        const user1 = await User.signIn('pho1@gmail.com', '123');
        const user2 = await User.signIn('pho2@gmail.com', '123');
        const story = await Story.addStoryWithUser(user1._id, 'JS', 'Javascript');
        await Story.addStoryWithUser(user1._id, 'PHP', 'My SQL');
        const comment = await Comment.createComment(user2._id, story._id, 'abcd');
        token1 = user1.token;
        token2 = user2.token;
        storyId = story._id.toString();
        commentId = comment._id.toString();
    });

    it('Can remove comment', async () => {
        const response = await request(app)
        .delete(`/comment/${commentId}`)
        .set({ token: token2 });
        assert.equal(response.body.success, true);
        assert.equal(response.body.comment.content, 'abcd');
        const num = await Comment.count({ });
        assert.equal(num, 0);
        const story = await Story.findById(storyId);
        assert.equal(story.comments.length, 0);
    });

    it('Cannot remove comment with wrong token', async() => {
        const response = await request(app)
        .delete(`/comment/${commentId}`)
        .set({ token: token1 });
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, CANNOT_FIND_COMMENT);
    });

    it('Cannot remove comment without token', async() => {
        const response = await request(app)
        .delete(`/comment/${commentId}`)
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, INVALID_TOKEN);
    });

    it('Cannot remove comment with wrong commentId', async() => {
        const response = await request(app)
        .delete(`/comment/${commentId}x`)
        .set({ token: token1 });
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, INVALID_OBJECT_ID);
    });
});
