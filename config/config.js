module.exports = function(app, express, mongoose) {

  var config = this;

  // Configuration
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/../views');
    app.set('view cache', __dirname + '/../app/cache');
    app.set('view options', {
      layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/../public'));
    app.use(app.router);
  });

  app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  express.env = process.env.NODE_ENV || 'development';

  return config;

};