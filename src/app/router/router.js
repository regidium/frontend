var self = module.exports = {};

var index = require('./routes/index');
var auth = require('./routes/auth');
var agent = require('./routes/agent');

self.init = function(app) {
    app.get('/', index.index);

    app.route('/registration')
        .get(auth.registration)
        .post(auth.registration)
    ;

    app.route('/login')
        .get(auth.login)
        .post(auth.login)
    ;

    app.get('/logout', auth.logout);

    app.route('/auth/external/service/:provider/connect')
        .get(auth.external_service_connect)
        .post(auth.external_service_connect)
    ;

    app.route('/auth/external/service/:provider/disconnect')
        .get(auth.external_service_disconnect)
        .post(auth.external_service_disconnect)
    ;

    app.get('/agent', agent.agent);
    app.get('/agent/*', agent.agent);

    app.get('*', index.index);
}