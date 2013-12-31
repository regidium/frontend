var config = require('./app/config/config/config.json'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    consolidate = require('consolidate'),
    i18n = require('i18n'),
    io = require('socket.io').listen(server);

i18n.configure(config.i18n);

// Configuration
app.configure(function() {
    app.set('views', config.paths.views);
    app.set('view cache', config.view.cache);
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.engine('.jade', consolidate.jade);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    app.use(i18n.init);
    app.locals.config = config;
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Routes
require('./app/routes/core')(app);
require('./app/routes/user')(app);
require('./app/routes/agent')(app);

// Start server
var port = process.env.PORT || 5001;

server.listen(port);
console.log("Server listen on: http://localhost:"+port);