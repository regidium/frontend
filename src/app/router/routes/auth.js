var external_services = require('../../../framework/external_services/external_services');

module.exports.registration = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.agent && req.agent.uid) {
                return res.redirect('/agent');
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
            var data = req.body;
            data.fullname = req.body.fullname;
            data.email = req.body.email;
            data.password = req.body.password;
            data.remember = req.body.remember;
            data.ip = req.ips.reverse()[0];

            res.backend.post({
                path: 'agents',
                data: data,
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
        if (data && data.agent) {
            res.authorizer.login(res, data.uid);
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
            if (req.agent && req.agent.uid) {
                return res.redirect('/agent');
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
                    remember: true
                },
                onSuccess: function (body) {
                    callback(null, body);
                },
                onErrors: function (body) {
                    /** @todo Сделать обработчик ошибок */
                    if (req.headers['xhr']) {
                        return res.send(body);
                    } else {
                        return res.redirect('/login');
                    }
                }
            });
        }

    ], function (err, data) {
        if (data && data.agent) {
            res.authorizer.login(res, data.agent);
            if (req.headers['xhr']) {
                res.send(data);
            } else {
                res.redirect('/');
            }
        } else if (data.length == 0) {
            /** @todo Сделать обработчик ошибок */
            if (req.headers['xhr']) {
                res.send({ errors: ['Agent no found!'] });
            } else {
                res.redirect('/login');
            }
        } else if (err) {
            console.log(err);
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
            if (req.agent && req.agent.uid) {
                callback(null);
            } else {
                return res.redirect('/');
            }
        },

        function (callback) {
            res.backend.get({
                path: 'logouts/' + req.agent.uid,
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
        res.authorizer.logout(res);
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
                    uid: req.agent.uid,
                    data: data,
                    security: { access_token: token }
                },
                onComplete: function (data) {
                    callback(null, data);
                },
                onError: function (data) {
                    /** @todo Сделать обработчик ошибок */
                    console.log(data);
                    callback(data);
                }
            });
        }

    ], function (err, data) {
        if (data.agent) {
            res.authorizer.login(res, data);
            res.redirect('/agent');
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