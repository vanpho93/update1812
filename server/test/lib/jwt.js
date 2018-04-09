const assert = require('assert');
const jwt = require('jsonwebtoken');
const { sign, verify } = require('../../src/lib/jwt');

describe('Test create and verify token', () => {
    it('Create new token', done => {
        jwt.sign({ name: 'Teo' }, 'JFHWHe97rcndsajh', { expiresIn: '2h' }, (err, token) => {
            assert.equal(err, null);
            // console.log(token);
            done();
        });
    });

    it('Can decode token', done => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVvIiwiaWF0IjoxNTE0OTAwMTAzfQ.EBu7Efq40pThKVm119b_QfaT_cLC71FErgBu4NfAxt4';
        jwt.verify(token, 'JFHWHe97rcndsajh', (err, obj) => {
            assert.equal(err, null);
            assert.equal(obj.name, 'Teo');
            done();
        });
    });
});

describe('Sign and Decode token', () => {
    it ('Can sign and verify by methods', async () => {
        const token = await sign({ name: 'Teo' });
        const obj = await verify(token);
        assert.equal(obj.name, 'Teo');
    });
});
