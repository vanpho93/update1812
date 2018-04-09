const assert = require('assert');
const request = require('supertest');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { verify } = require('../../../src/lib/jwt');
const { CANNOT_FIND_USER } = require('../../../src/lib/ErrorCode');

describe('Test POST /friend/accept', () => {
    let idUser1, idUser2, idUser3, token1, token2, token3;
    
    beforeEach('Create users for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        await User.signUp('teo@gmail.com', '321', 'Teo');
        await User.signUp('ti@gmail.com', '333', 'Ti');
        const user1 = await User.signIn('pho1@gmail.com', '123');
        const user2 = await User.signIn('teo@gmail.com', '321');
        const user3 = await User.signIn('ti@gmail.com', '333');
        idUser1 = user1._id;
        idUser2 = user2._id;
        idUser3 = user3._id;
        token1 = user1.token;
        token2 = user2.token;
        token3 = user3.token;
        await User.addFriend(idUser1, idUser2);
    });

    it('Can accept friend POST', async () => {
        const response = await request(app)
        .post('/friend/accept')
        .set({ token: token2 })
        .send({ idFriend: idUser1 });
        const { success, friend } = response.body;
        const { name, email, _id } = friend;
        assert.equal(success, true);
        assert.equal(name, 'Pho');
        assert.equal(email, 'pho1@gmail.com');
        const user = await User.findById(idUser2);
        const receiver = await User.findById(idUser1);
        assert.equal(user.sentRequests.length, 0);
        assert.equal(receiver.incommingRequests.length, 0);
        assert.equal(receiver.friends[0].toString(), user._id.toString());
        assert.equal(user.friends[0].toString(), receiver._id.toString());
    });

    it('Cannot accept friend', async () => {
        const response = await request(app)
        .post('/friend/accept')
        .set({ token: token3 })
        .send({ idFriend: idUser1 });
        assert.equal(response.status, 404);
        assert.equal(response.body.code, CANNOT_FIND_USER);
    });

    it('Cannot accept friend', async () => {
        const response = await request(app)
        .post('/friend/accept')
        .set({ token: token1 })
        .send({ idFriend: idUser2 });
        assert.equal(response.status, 404);
        assert.equal(response.body.code, CANNOT_FIND_USER);
    });
});
