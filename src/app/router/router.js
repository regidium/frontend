var self = module.exports = {};

var index = require('./routes/index');
var auth = require('./routes/auth');
var agent = require('./routes/agent');

self.init = function(app) {
    app.get('/', index.index);

    app.get('/registration', auth.registration);
    app.post('/registration', auth.registration);

    app.get('/login', auth.login);
    app.post('/login', auth.login);

    app.get('/logout', auth.logout);

    app.get('/auth/external/service/:provider/connect', auth.external_service_connect);
    app.post('/auth/external/service/:provider/connect', auth.external_service_connect);
    app.get('/auth/external/service/:provider/disconnect', auth.external_service_disconnect);
    app.post('/auth/external/service/:provider/disconnect', auth.external_service_disconnect);

    app.get('/agent', agent.agent);
    app.get('/agent/*', agent.agent);

    app.get('*', index.index);
}