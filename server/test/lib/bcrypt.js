const assert = require('assert');
const { hash, compare } = require('bcrypt');

xdescribe('Test hash bcrypt', () => {
    it('Can create new hash', async () => {
        const encrypted = await hash('1234', 8);
        const encrypted2 = await hash('1234', 8);
    });

    it('Can create new hash with promise', async () => {
        hash('123', 8)
        .then(encrypted => console.log(encrypted))
        .catch(err => console.log(err));
    });
});

describe('Test compare bcrypt', () => {
    let encrypted;
    beforeEach('Hash a password for test', async () => {
        encrypted = await hash('1234', 8);
    });

    it('Can verify with right password', async () => {
        const same = await compare('1234', encrypted);
        assert.equal(same, true);
    });

    it('Cannot verify with wrong password', async () => {
        const same = await compare('12345', encrypted);
        assert.equal(same, false);
    });

    it('Can verify with password using promise', (done) => {
        compare('1234', encrypted)
        .then(same => {
            assert.equal(same, true);
            done();
        });
    });
});