const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/mean1811-test';
    if (process.env.NODE_ENV === 'production') return 'mongodb://abcd:xyz@ds229549.mlab.com:29549/mean1812';
    return 'mongodb://localhost/mean1811';
}

mongoose.connect(getDatabaseUri(), { useMongoClient: true })
.catch(err => {
    console.log(err.message);
    process.exit(1);
});
