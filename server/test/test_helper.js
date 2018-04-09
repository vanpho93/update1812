const Story = require('../src/models/Story');
const User = require('../src/models/User');
const Comment = require('../src/models/Comment');
require('../src/startDatabase');

beforeEach('Remove all docs before it', async () => {
    await Story.remove({});
    await User.remove({});
    await Comment.remove({});
});
