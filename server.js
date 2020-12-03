const connect = require('connect');
const serveStatic = require('serve-static');

const port = process.env.PORT || process.argv[2] || 8000;
const project = process.env.NODE_ENV === 'production' ? require('./config.json').buildFolder : './app';

connect().use(serveStatic(project)).listen(port, function() {
    console.log('Server running on %s...', port);
});
