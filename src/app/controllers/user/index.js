var self = module.exports;

self.index = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.user) {
                return res.redirect('/login');
            }
            callback(null);
        },

        function (callback) {
            res.render('user/index');
        }

    ]);
};