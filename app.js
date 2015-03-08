require('newrelic');
var restify = require('restify');
var mongoose = require('mongoose');
var authLib = require('./libs/authLib.js');

var server = restify.createServer({
    name:'SchoolTrackr-API',
    version: '0.0.1'
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 5000
    , ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
server.listen(port, ip, function() {
    console.log('%s running at %s', server.name, server.url);
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.CORS());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.throttle({
    burst: 100,
    rate: 75,
    ip: true
}));
server.use(function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
});
server.use(function(req, res, next) {
    if (req.url === '/api/auth/authenticate') {
        return next()
    } else if (req.url === '/api') {
        return next()
    } else {
        authLib.verify(req, res, next)
    }
});

var databaseURL = process.env.databaseURL;
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    databaseURL = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(databaseURL, function(err) {
    if (err) console.log('Error connecting to MongoDB: ' + err); else console.log('Successfully connected to MongoDB')
});






// Start Routing
server.get('/', function(req, res, next) {
    res.send(200, 'Hello!')
});
server.get('/api', function(req, res, next) {
    var response = {
        name: server.name,
        version: server.version
    };
    res.send(200, response)
});

// Fix Options requests per https://github.com/mcavage/node-restify/issues/284
function unknownMethodHandler(req, res) {
    if (req.method.toLowerCase() === 'options') {
        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Authorization', 'x-access-token'];
        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        return res.send(204);
    }
    else
        return res.send(new restify.MethodNotAllowedError());
}
server.on('MethodNotAllowed', unknownMethodHandler);

// Register routes
require('./routes/tardies.js')(server);
require('./routes/students.js')(server);
require('./routes/users.js')(server);
require('./routes/people.js')(server);
require('./routes/notifications.js')(server);
require('./routes/auth.js')(server);
