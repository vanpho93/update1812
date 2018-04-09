const { Types } = require('mongoose');
const MyError = require('./MyError');
const { INVALID_OBJECT_ID } = require('./ErrorCode');

function checkObjectIds(ids) {
    try {
        ids.forEach(id => new Types.ObjectId(id))
    } catch (error) {
        throw new MyError('Invalid ObjectId', INVALID_OBJECT_ID, 400);
    }
}

module.exports = { checkObjectIds };
