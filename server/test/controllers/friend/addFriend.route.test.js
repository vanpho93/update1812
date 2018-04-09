const assert = require('assert');
const request = require('supertest');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { verify } = require('../../../src/lib/jwt');
const { CANNOT_FIND_USER, INVALID_FRIEND_REQUEST } = require('../../../src/lib/ErrorCode');

describe('Test POST /friend/request', () => {
    let idUser1, idUser2, token1, token2;
    
    beforeEach('Create user for test', async () => {
        await User.signUp('pho1@gmail.com', '123', 'Pho');
        await User.signUp('teo@gmail.com', '321', 'Teo');
        const user1 = await User.signIn('pho1@gmail.com', '123');
        const user2 = await User.signIn('teo@gmail.com', '321');
        idUser1 = user1._id;
        idUser2 = user2._id;
        token1 = user1.token;
        token2 = user2.token;
    });

    it('Can check sign in status by POST', async () => {
        const response = await request(app)
        .post('/friend/request')
        .set({ token: token1 })
        .send({ idFriend: idUser2 });
        const { success, friend } = response.body;
        const { name, email, _id } = friend;
        assert.equal(success, true);
        assert.equal(name, 'Teo');
        assert.equal(email, 'teo@gmail.com');
        const user = await User.findById(idUser1);
        const receiver = await User.findById(idUser2);
        assert.equal(user.sentRequests[0].toString(), idUser2.toString());
        assert.equal(receiver.incommingRequests[0].toString(), idUser1.toString());
    });

    it('Cannot send request twice', async () => {
        await User.addFriend(idUser1, idUser2);
        const response = await request(app)
        .post('/friend/request')
        .set({ token: token1 })
        .send({ idFriend: idUser2 });
        assert.equal(response.body.code, INVALID_FRIEND_REQUEST);
        assert.equal(response.status, 401);
    });

    it('Cannot send request for user, who sent you,', async () => {
        await User.addFriend(idUser1, idUser2);
        const response = await request(app)
        .post('/friend/request')
        .set({ token: token2 })
        .send({ idFriend: idUser1 });
        assert.equal(response.body.code, INVALID_FRIEND_REQUEST);
        assert.equal(response.status, 401);
    });
});
