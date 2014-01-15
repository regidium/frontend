var http = require('http');
var consolidate = require('consolidate');
var config = require('./config/config/config.json');
var framework = require('./src/framework/framework');
var router = require('./src/app/router/router');

var app = framework.init();
var server = http.createServer(app);
var io = require('socket.io').listen(server)
    .set('log level', 2)
    .set('close timeout', 35)
    .set('max reconnection attempts', 100)
    .set('heartbeat timeout', 60)
    .set('heartbeat interval', 25)
    .set('authorization', function (handshake_data, callback) { framework.authorizer.io_check(handshake_data, callback); });

var socket = require('./src/app/socket/socket.js');
socket.init(io);

app.set(config.env);
app.locals.env = config.env;
app.locals.config = config;

app.configure(function() {
    app.set('port', config.server.port);

    app.set('views', './src/app/views');
    app.set('view engine', 'jade');
    app.set('view cache', config.view.cache);
    app.engine('.jade', consolidate.jade);

    app.use(framework.express.favicon());
    app.use(framework.express.compress());
    app.use(framework.express.bodyParser());
    app.use(framework.express.cookieParser());
    app.use(framework.express.cookieSession({ key: config.session.key, secret: config.session.secret, cookie: { maxAge: config.session.max_age * 1000 } }));
    app.use(framework.express.methodOverride());
    app.use(framework.express.static('./public'));
    app.use(framework.authorizer.check);
    app.use(app.router);
});

app.configure('development', function() {
    app.use(framework.express.logger('dev'));
    app.use(function(err, req, res, next) {
        if (!err) {
            return next();
        }

        if (req.headers['xhr']) {
            res.json({error: err});
        } else {
            res.status(500);
            res.render('common/error', { error: err });
        }
    });
});

app.configure('production', function() {});

// Routes
router.init(app);

io.sockets.on('connection', socket.run);

var response = require('http').ServerResponse.prototype;
response.backend = framework.backend;
response.async = framework.async;
response.authorizer = framework.authorizer;

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});