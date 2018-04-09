const assert = require('assert');
const request = require('supertest');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { verify, sign } = require('../../../src/lib/jwt');
const { INVALID_TOKEN, CANNOT_FIND_USER } = require('../../../src/lib/ErrorCode');

describe('Test POST /user/check', () => {
    let token, idUser;
    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        const user = await User.signIn('pho1@gmail.com', '123');
        idUser = user._id;
        token = user.token;
    });

    it('Can check sign in status by POST', async () => {
        const response = await request(app)
        .post('/user/check')
        .set({ token });
        const { success, user } = response.body;
        const { email, name, _id } = user;
        assert.equal(success, true);
        assert.equal(email, 'pho1@gmail.com');
        assert.equal(name, 'Pho');
        const obj = await verify(token);
        assert.equal(obj._id, _id)
    });

    it('Cannot check sign in status with wrong token', async () => {
        const response = await request(app)
        .post('/user/check')
        .set({ token: token + 'x' });
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, INVALID_TOKEN);
    });

    it('Cannot check sign in status without token', async () => {
        const response = await request(app)
        .post('/user/check');
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, INVALID_TOKEN);
    });

    it('Cannot check sign in for removed user.', async () => {
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
        .post('/user/check')
        .set({ token });
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, CANNOT_FIND_USER);
    });

    it('Cannot check sign in with faked token.', async () => {
        const token = await sign({ _id: 'a' });
        await User.findByIdAndRemove(idUser);
        const response = await request(app)
        .post('/user/check')
        .set({ token });
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, INVALID_TOKEN);
    });
});
