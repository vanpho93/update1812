const assert = require('assert');
const request = require('supertest');
const Story = require('../../../src/models/Story');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { verify, sign } = require('../../../src/lib/jwt');

const { INVALID_TOKEN, CANNOT_FIND_USER, INVALID_OBJECT_ID } = require('../../../src/lib/ErrorCode');

describe('Test POST /story', () => {
    let token, idUser;
    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        const user = await User.signIn('pho1@gmail.com', '123');
        token = user.token;
        idUser = user._id;
    });

    it('Can add new story by POST', async () => {
        const response = await request(app)
        .post('/story')
        .set({ token })
        .send({ content: 'Javascript', title: 'JS' });
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.story.title, 'JS');
        const story = await Story.findOne({}).populate('author');
        assert.equal(story.title, 'JS');
        assert.equal(story.content, 'Javascript');
        assert.equal(story.author.email, 'pho1@gmail.com');
    });

    it('Cannot add new story without token', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'Javascript', title: 'JS' });
        assert.equal(response.status, 400);
        assert.equal(response.body.code, INVALID_TOKEN);
    });

    it('Cannot add new story for removed user.', async () => {
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
        .post('/story')
        .set({ token })
        .send({ content: 'Javascript', title: 'JS' });
        assert.equal(response.status, 400);
        assert.equal(response.body.code, CANNOT_FIND_USER);
        const storyCount = await Story.count({});
        assert.equal(storyCount, 0);
    });

    it('Cannot add new story with fake token', async () => {
        const token = await sign({ _id: 'a' });
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
        .post('/story')
        .set({ token })
        .send({ content: 'Javascript', title: 'JS' });
        assert.equal(response.body.code, INVALID_OBJECT_ID)
        assert.equal(response.body.success, false);
    });
});
