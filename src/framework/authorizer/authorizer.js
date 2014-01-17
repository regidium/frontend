var _ = require('underscore'),
    async = require('async'),
    sha1 = require('sha1'),
    config = require('../../../config/config/config.json'),
    backend = require('../backend/backend');

var self = module.exports = function () { };

self.login = function (res, object, remember) {
    if (object && (object.user || object.agent)) {
        var object_id = object.user ? object.user.uid : object.agent.uid;
        res.cookie(config.authorizer.key, self.generateToken(object_id, remember), {
            expires: new Date(self.calcLifetime(remember)),
            path:    '/'
        });
        /** @todo Перевести user и agent на object */
        self.flush_auth(res, object);
    }
};

self.logout = function (res) {
    res.clearCookie(config.authorizer.key);
    res.clearCookie('user');
    res.clearCookie('agent');
};

self.io_check = function (handshake_data, callback) {
    if (handshake_data.headers.cookie) {
        var cookie = require('cookie').parse(handshake_data.headers.cookie);
        var token = cookie[config.authorizer.key];

        var object_id = self.validateToken(token);
        if (!object_id) return callback(null, false);
        handshake_data.object_id = object_id;

        self.flush_object_data(handshake_data, function () {
            callback(null, true);
        });
    } else {
        callback(null, false);
    }
};

self.check = function (req, res, next) {
    var token = req.cookies[config.authorizer.key];
    if (!token) return next();
    var object_id = self.validateToken(token);
    if (!object_id) return next();
    req.object_id = object_id;
    self.flush_object_data(req, function () {
        next();
        self.flush_auth(res, req);
    });
};

self.flush_object_data = function (obj, cb) {
    async.waterfall([

        function (callback) {
            if (obj.user) {
                obj.object_id = obj.agent.uid;
            } else if (obj.agent) {
                obj.object_id = obj.agent.uid;
            }

            if (obj.object_id) {
                callback(null);
            }

            else cb();
        },

        function (callback) {
            backend.get({
                path: 'logins/' + obj.object_id + '/check',
                data: {},
                onComplete: function (data) {
                    callback(null, data);
                }
            });
        },

        function (data, callback) {
            if (data && data && data.user) {
                obj.user = data.user;
                delete obj.object_id;
            } else if (data && data && data.agent) {
                obj.agent = data.agent;
                delete obj.object_id;
            } else {
                console.error('Backend return error response! ' + data);
            }
            cb();
        }

    ]);
};

self.validateToken = function (token) {
    var decodedToken = self.decode(token);
    var tokenParts = decodedToken.split(':');
    if (tokenParts.length != 3) {
        return false;
    }

    var object_id = tokenParts[0];
    var lifetime = tokenParts[1];
    var decodedToken = self.decode(tokenParts[2]);
    if (lifetime < Date.now()) {
        return false;
    }

    var validToken = self.generateToken(object_id, lifetime);
    if (validToken != token) {
        return false;
    }

    return object_id;
};

self.generateToken = function (object_id, lifetime) {
    if (typeof(lifetime) == 'boolean') {
        lifetime = self.calcLifetime(lifetime);
    }

    return self.encode('' + object_id + ':' + lifetime + ':' + self.encode(sha1(config.authorizer.secret + object_id + lifetime)));
};

self.calcLifetime = function (remember) {
    if (remember) {
        /** Запомнить сессию на 1 месяц */
        return Date.now() + 4320000000;
    } else {
        return Date.now() + config.session.max_age * 1000;
    }
};

self.encode = function (unencoded) {
    return new Buffer(unencoded || '').toString('base64');
};

self.decode = function (encoded) {
    return new Buffer(encoded || '', 'base64').toString('utf8');
};

self.flush_auth = function(res, object) {
    if (object.user) {
        var data = JSON.stringify(object.user, function(key, val) {
            if (key == 'fullname') {
                return encodeURIComponent(val);
            } else {
                return val;
            }
        });
        res.cookie('user', data, {
            expires: new Date(self.calcLifetime()),
            path: '/'
        });
    } else if (object.agent) {
        var data = JSON.stringify(object.agent, function(key, val) {
            if (key == 'fullname') {
                return encodeURIComponent(val);
            } else {
                return val;
            }
        });
        res.cookie('agent', data, {
            expires: new Date(self.calcLifetime()),
            path: '/'
        });
    }
}