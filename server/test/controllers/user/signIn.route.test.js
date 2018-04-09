const assert = require('assert');
const request = require('supertest');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { verify } = require('../../../src/lib/jwt');
const { INVALID_SIGN_IN_USER_INFO } = require('../../../src/lib/ErrorCode');

describe('Test POST /user/signup', () => {
    let idUser;
    beforeEach('Sign up user for test', async () => {
        const user = await User.signUp('teo@gmail.com', '123', 'TEO');
        idUser = user._id;
    });

    it('Can sign in by POST', async () => {
        const response = await request(app)
        .post('/user/signin')
        .send({ email: 'teo@gmail.com', password: '123' });
        const { success, user } = response.body;
        const { email, name, token, _id } = user;
        assert.equal(success, true);
        assert.equal(_id, idUser);
        assert.equal(email, 'teo@gmail.com');
        assert.equal(name, 'TEO');
        const obj = await verify(token);
        assert.equal(obj._id, _id)
    });

    it('Cannot sign in with wrong password', async () => {
        const response = await request(app)
        .post('/user/signin')
        .send({ email: 'teo@gmail.com', password: '1234' });
        const { success, code } = response.body;
        assert.equal(success, false);
        assert.equal(code, INVALID_SIGN_IN_USER_INFO);
    });

    it('Cannot sign in with wrong email', async () => {
        const response = await request(app)
        .post('/user/signin')
        .send({ email: 'teo1@gmail.com', password: '1234' });
        const { success, code } = response.body;
        assert.equal(success, false);
        assert.equal(code, INVALID_SIGN_IN_USER_INFO);
    });
});
