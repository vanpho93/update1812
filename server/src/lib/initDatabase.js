const faker = require('faker');
const User = require('../models/User');

async function initDatabaseIfTestingUI() {
    if (process.env.NODE_ENV) return;
    const userCount = await User.count({});
    if (userCount > 20) return;
    for (let index = 0; index < 30; index++) {
        await User.signUp(faker.internet.email(), '123', faker.name.findName())
    }
}

initDatabaseIfTestingUI();
