var self = module.exports;

self.logout = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.user && !req.agent) {
                return res.redirect('/');
            }
            callback(null);
        },

        function (callback) {
            res.backend.post({
                path: 'auth/' + (req.user ? req.user.uid : req.agent.uid) + '/logout',
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