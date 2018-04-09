const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../lib/jwt');
const MyError = require('../lib/MyError');
const { checkObjectIds } = require('../lib/checkObjectIds');
const {
    INVALID_SIGN_IN_USER_INFO,
    CANNOT_FIND_USER,
    INVALID_SIGN_UP_USER_INFO,
    EMAIL_EXISTED,
    INVALID_TOKEN,
    INVALID_FRIEND_REQUEST
} = require('../lib/ErrorCode');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    password: { type: String, required: true },
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    incommingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const UserModel = mongoose.model('User', userSchema);
class User extends UserModel {
    static async signUp(email, password, name) {
        const encrypted = await hash(password, 8);
        const user = new User({ email, password: encrypted, name });
        const error = user.validateSync();
        if (error) throw new MyError('User info is invalid', INVALID_SIGN_UP_USER_INFO, 400);
        await user.save().catch(error => {
            throw new MyError('Duplicated email', EMAIL_EXISTED, 409);
        });
        const u = user.toObject();
        delete u.password;
        return u;
    }

    static async signIn(email, password) {
        const user = await User.findOne({ email }).populate('stories');
        if (!user) throw new MyError('Invalid user info.', INVALID_SIGN_IN_USER_INFO, 404);
        const same = await compare(password, user.password);
        if (!same) throw new MyError('Invalid user info.', INVALID_SIGN_IN_USER_INFO, 404);
        const u = user.toObject();
        delete u.password;
        const token = await sign({ _id: u._id });
        u.token = token;
        return u;
    }

    static async check(oldToken) {
        const { _id } = await verify(oldToken)
        .catch(error => {
            throw new MyError('Invalid token.', INVALID_TOKEN, 400);
        });
        const user = await User.findById(_id).catch(error => {
            throw new MyError('Cannot find user', INVALID_TOKEN, 400);
        });
        if (!user) throw new MyError('Cannot find user', CANNOT_FIND_USER, 404);
        const u = user.toObject();
        delete u.password;
        const token = await sign({ _id: u._id });
        u.token = token;
        return u;
    }

    static async addFriend(idUser, idFriend) {
        checkObjectIds([idUser, idFriend]);
        const userTest = await User.findOne({
            _id: idUser,
            $or: [
                { incommingRequests: { $all: [idFriend] } },
                { sentRequests: { $all: [idFriend] } },
                { friends: { $all: [idFriend] } },
            ]
        });
        if (userTest) throw new MyError('Invalid friend request.', INVALID_FRIEND_REQUEST, 401);
        const user = await User.findByIdAndUpdate(idUser, { $addToSet: { sentRequests: idFriend } })
        if (!user) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const friend = await User.findByIdAndUpdate(idFriend, { $addToSet: { incommingRequests: idUser } }).select(['email', 'name', 'stories']);
        if (!friend) {
            await User.findByIdAndUpdate(idUser, { $pull: { sentRequests: idFriend } });
            throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        }
        return friend;
    }

    static async acceptFriend(idUser, idFriend) {
        checkObjectIds([idFriend, idUser]);
        const queryObject1 = { _id: idUser, incommingRequests: { $all: [idFriend] } };
        const updateObject1 = { 
            $pull: { incommingRequests: idFriend },
            $addToSet: { friends: idFriend }
        };
        const user = await User.findOneAndUpdate(queryObject1, updateObject1);
        if (!user) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const queryObject2 = { _id: idFriend, sentRequests: { $all: [idUser] } };
        const updateObject2 = { 
            $pull: { sentRequests: idUser },
            $addToSet: { friends: idUser }
        };
        const friend = await User.findOneAndUpdate(queryObject2, updateObject2).select(['email', 'name', 'stories']);
        if (!friend) {
            await User.findByIdAndUpdate(idUser, { $pull: { friends: idFriend } });
            throw new MyError('Cannot find user', CANNOT_FIND_USER, 404);
        }
        return friend;
    }
    
    static async removeFriend(idUser, idFriend) {
        checkObjectIds([idUser, idFriend]);
        const queryObject1 = { _id: idUser, friends: { $all: [idFriend] } };
        const user = await User.findOneAndUpdate(queryObject1, { $pull: { friends: idFriend } });
        if (!user) throw new MyError('Cannot find user', CANNOT_FIND_USER, 404);
        const friend = await User.findByIdAndUpdate(idFriend, { $pull: { friends: idUser } }).select(['email', 'name', 'stories']);
        if (!friend) throw new MyError('Cannot find user', CANNOT_FIND_USER, 404);
        return friend;
    }

    static async getUsers(idUser) {
        checkObjectIds([idUser]);
        const { friends } = await User.findById(idUser, { friends: 1 }).populate('friends', 'name');
        const { sentRequests } = await User.findById(idUser, { sentRequests: 1 }).populate('sentRequests', 'name');
        const { incommingRequests } = await User.findById(idUser, { incommingRequests: 1 }).populate('incommingRequests', 'name');
        const knownUsers = friends.concat(sentRequests).concat(incommingRequests);
        const _idKnownUsers = knownUsers.map(u => u._id).concat(idUser);
        const otherUsers = await User.find({ _id: { $nin: _idKnownUsers } }, { name: 1 })
        return { friends, sentRequests, incommingRequests, otherUsers };
    }
}

module.exports = User;
