var _ = require('underscore'),
    async = require('async'),
    sha1 = require('sha1'),
    config = require('../../../config/config/config.json'),
    backend = require('../backend/backend');

var self = module.exports = function () { };

self.login = function (res, object) {
    if (object) {
        var object_id = object.uid;
        res.cookie(config.authorizer.key, self.generateToken(object_id, true), {
            //expires: new Date(self.calcLifetime(remember)),
            path:    '/'
        });
        self.flush_auth(res, object, function() {});
    }
};

self.logout = function (res) {
    res.clearCookie(config.authorizer.key);
    res.clearCookie('agent');
};

self.check = function (req, res, next) {
    var token = req.cookies[config.authorizer.key];
    if (!token) return next();
    var object_id = self.validateToken(token);
    if (!object_id) return next();
    req.object_id = object_id;
    self.flush_object_data(req, function () {
        next();
        self.flush_auth(res, req, next);
    });
};

self.flush_object_data = function (obj, cb) {
    async.waterfall([

        function (callback) {
            if (obj.agent) {
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
            if (data && data.uid) {
                obj.agent = data;
                delete obj.object_id;
            } else {
                console.error('Backend return error response! ', data);
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

self.flush_auth = function(res, object, next) {
    if (object.agent) {
        var data = JSON.stringify(object.agent, function(key, val) {
            if (key == 'first_name' || key == 'last_name' || key == 'job_title') {
                return encodeURIComponent(val);
            } else {
                return val;
            }
        });
        try {
            res.cookie('agent', data, {
                //expires: new Date(self.calcLifetime(true)),
                path: '/'
            });
        } catch(e) {
            next();
        }
    }
}