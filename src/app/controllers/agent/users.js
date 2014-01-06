var self = module.exports;

self.list = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.agent) {
                return res.redirect('/login');
            }
            callback(null);
        },

        function (callback) {
            res.backend.get({
                path: 'user/all',
                onSuccess: function (body) {
                    callback(null, body);
                },
                onErrors: function (body) {
                    /** @todo Сделать обработчик ошибок */
                    return body;
                }
            });
        }

    ], function (err, data) {
            if (req.headers.xhr) {
                res.send(data);
            } else {
                res.render('agent/users/list', { users: data });
            }
        }
    );
};