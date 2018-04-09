const assert = require('assert');
const request = require('supertest');
const User = require('../../../src/models/User');
const app = require('../../../src/app');
const { CANNOT_FIND_USER, INVALID_FRIEND_REQUEST, INVALID_TOKEN, INVALID_OBJECT_ID } = require('../../../src/lib/ErrorCode');

describe('Test DELETE /friend/:idFriend', () => {
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
        await User.acceptFriend(idUser2, idUser1);
    });

    it('Can remove friend by DELETE', async () => {
        const response = await request(app)
        .delete(`/friend/${idUser1}`)
        .set({ token: token2 });
        const user = await User.findById(idUser2);
        const receiver = await User.findById(idUser1);
        assert.equal(user.friends.length, 0);
        assert.equal(receiver.friends.length, 0);
    });

    it('Cannot remove friend when 2 user are not friends', async () => {
        const response = await request(app)
        .delete(`/friend/${idUser1}`)
        .set({ token: token3 });
        assert.equal(response.body.code, CANNOT_FIND_USER);
    });

    it('Cannot remove friend without token', async () => {
        const response = await request(app)
        .delete(`/friend/${idUser1}`)
        assert.equal(response.body.code, INVALID_TOKEN);
    });

    it('Cannot remove friend with wrong friend id', async () => {
        const response = await request(app)
        .delete(`/friend/${idUser1}x`)
        .set({ token: token2 });
        assert.equal(response.body.code, INVALID_OBJECT_ID);
    });
});
