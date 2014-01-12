var self = module.exports = {};

var index = require('./routes/index');
var auth = require('./routes/auth');
var agent = require('./routes/agent');
var user = require('./routes/user');

self.init = function(app) {
    app.get('/', index.index);

    app.get('/register', auth.register);
    app.post('/register', auth.register);

    app.get('/login', auth.login);
    app.post('/login', auth.login);

    app.get('/logout', auth.logout);

    app.get('/auth/external/service/:provider/connect', auth.external_service_connect);
    app.post('/auth/external/service/:provider/connect', auth.external_service_connect);
    app.get('/auth/external/service/:provider/disconnect', auth.external_service_disconnect);
    app.post('/auth/external/service/:provider/disconnect', auth.external_service_disconnect);

    app.get('/agent', agent.agent);
    app.get('/agent/*', agent.agent);

    app.get('/user', user.user);
    app.get('/user/*', user.user);

    app.get('*', index.index);
}