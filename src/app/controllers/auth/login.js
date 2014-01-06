var self = module.exports;

self.login = function (req, res) {
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
                path: 'auth/login',
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
        } else {
            /** @todo Сделать обработчик ошибок */
            if (req.headers['xhr']) {
                res.send({ errors: ['Backend return bad data!'] });
            } else {
                res.redirect('/login');
            }
        }
    });
};