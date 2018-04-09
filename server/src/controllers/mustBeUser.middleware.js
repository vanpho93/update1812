const { verify } = require('../lib/jwt');
const { INVALID_TOKEN } = require('../lib/ErrorCode');

const mustBeUser = (req, res, next) => {
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(error => {
        res
        .status(400)
        .send({ success: false, error: error.message, code: INVALID_TOKEN });
    });
}

module.exports = mustBeUser;
