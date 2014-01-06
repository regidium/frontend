var self = module.exports;
var external_services = require('../../../framework/external_services/external_services');

self.connect = function (req, res) {
    var provider = new external_services(req.params.provider, req, res);
    var token = null;

    res.async.waterfall([
        /** Handle error */
        function (callback) {
            if (!req.query.error && !req.query.error_code && !req.query.denied) {
                return callback(null);
            }
            delete req.session.oauth;
            return res.send({'errors': ['Error external service login register']});
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
                path: 'auth/' + req.params.provider + '/externalservice/connect',
                data: {
                    uid: req.user ? req.user.uid : null,
                    data: data,
                    security: { access_token: token }
                },
                onComplete: function (data) {
                    console.log(data);
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
self.disconnect = function (req, res) {
    res.send({ 'success': ['External service disconnect']});
};