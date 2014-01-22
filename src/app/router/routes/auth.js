var external_services = require('../../../framework/external_services/external_services');

module.exports.registration = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.agent) {
                return res.redirect('/agent');
            } else if (req.user) {
                return res.redirect('/user');
            }
            callback(null);
        },

        function (callback) {
            if (req.method == 'POST') {
                return callback(null);
            }
            return res.render('main/index');
        },

        function (callback) {
            res.backend.post({
                path: 'registrations',
                data: {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: req.body.password,
                    remember: req.body.remember
                },
                onSuccess: function (body) {
                    callback(null, body);
                },
                onErrors: function (body) {
                    /** @todo Сделать обработчик ошибок */
                    console.log(body);
                    return body;
                }
            });
        }

    ], function (err, data) {
        if (data.user) {
            res.authorizer.login(res, data, req.body.remember);
            if (req.headers['xhr']) {
                res.send(data);
            } else {
                res.redirect('/');
            }
        } else {
            /** @todo Сделать обработчик ошибок */
            if (req.headers['xhr']) {
                res.send({ errors: ['Backend return bad data!'] });
            } else {
                res.redirect('/registration');
            }
        }
    });
};

exports.login = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.agent) {
                return res.redirect('/agent');
            } else if (req.user) {
                return res.redirect('/user');
            }
            callback(null);
        },

        function (callback) {
            if (req.method == 'POST') {
                return callback(null);
            }
            return res.render('main/index');
        },

        function (callback) {
            res.backend.post({
                path: 'logins',
                data: {
                    email: req.body.email,
                    password: req.body.password,
                    remember: req.body.remember
                },
                onSuccess: function (body) {
                    callback(null, body);
                },
                onErrors: function (body) {
                    /** @todo Сделать обработчик ошибок */
                    console.log(body);
                    return body;
                }
            });
        }

    ], function (err, data) {
        if (data.user || data.agent) {
            res.authorizer.login(res, data, req.body.remember);
            if (req.headers['xhr']) {
                res.send(data);
            } else {
                res.redirect('/');
            }
        } else if (data.length == 0) {
            /** @todo Сделать обработчик ошибок */
            if (req.headers['xhr']) {
                res.send({ errors: ['User no found!'] });
            } else {
                res.redirect('/login');
            }
        } else if (err) {
            /** @todo Сделать обработчик ошибок */
            if (req.headers['xhr']) {
                res.send({ errors: ['Backend return bad data!'] });
            } else {
                res.redirect('/login');
            }
        }
    });
};

exports.logout = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.user && !req.agent) {
                return res.redirect('/');
            }
            callback(null);
        },

        function (callback) {
            res.backend.get({
                path: 'logouts/' + (req.user ? req.user.uid : req.agent.uid),
                onSuccess: function (body) {
                    callback(null);
                },
                onErrors: function (body) {
                    /** @todo Сделать обработчик ошибок */
                    console.log(body);
                    return body;
                }
            });
        }

    ], function (err) {
        res.authorizer.logout(res)
        res.send(true);
    });
};

exports.external_service_connect = function (req, res) {
    var provider = new external_services(req.params.provider, req, res);
    var token = null;

    res.async.waterfall([
        /** Handle error */
            function (callback) {
            if (!req.query.error && !req.query.error_code && !req.query.denied) {
                return callback(null);
            }
            delete req.session.oauth;
            return res.send({'errors': ['Error external service login registration']});
        },

        /** Connect with external service */
            function (callback) {
            provider.connect(function(err, access_token, refresh_token) {
                token = access_token;
                callback(err, access_token, refresh_token);
            });
        },

        /** Get profile info */
            function (access_token, refresh_token, callback) {
            provider.getProfileInfo(access_token, function(err, data) {
                callback(err, data);
            });
        },

        /** sending request to backend */
            function (data, callback) {
            res.backend.post({
                path: 'auths/' + req.params.provider + '/externalservice/connect',
                data: {
                    uid: req.user ? req.user.uid : null,
                    data: data,
                    security: { access_token: token }
                },
                onComplete: function (data) {
                    callback(null, data);
                },
                onError: function (data) {
                    console.log(data);
                    callback(data);
                }
            });
        }

    ], function (err, data) {
        if (data.user || data.agent) {
            res.authorizer.login(res, data, true);
            res.redirect('/'+(data.user ? 'user' : 'agent'));
        } else {
            res.redirect('/');
        }
    });
};

/**
 * @todo Реализовать
 */
module.exports.external_service_disconnect = function (req, res) {
    res.send({ 'success': ['External service disconnect']});
};