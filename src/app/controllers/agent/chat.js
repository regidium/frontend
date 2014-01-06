var self = module.exports;

self.chat = function (req, res) {
    res.async.waterfall([

        /** todo Вынести проверку в абстракцию */
        function (callback) {
            if (!req.agent) {
                return res.redirect('/login');
            }
            callback(null);
        },

        function (callback) {
            res.render('agent/chat/index');
        }

    ]);
};