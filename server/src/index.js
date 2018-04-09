require('./startDatabase');
require('./lib/initDatabase');
const app = require('./app');

app.listen(process.env.PORT || 3000, () => console.log('Server started!'));
