
var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app),
  routes = require('./routes'),
  socket = require('./routes/socket.js'),
  io = require('socket.io').listen(server);

// Heroku config only
/*if(process.env.PORT) {
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
}*/

// Configuration
var config = require('./config/config')(app, express);

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', socket);
io.set('log level', 2)
  .set('close timeout', 35)
  .set('max reconnection attempts', 100)
  .set('heartbeat timeout', 60)
  .set('heartbeat interval', 25)

// Start server
var port = process.env.PORT || 5000;

server.listen(port);