var self = module.exports;

self.index = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.agent) {
                return res.redirect('/login');
            }
            callback(null);
        },

        function (callback) {
            res.render('agent/index');
        }

    ]);
};