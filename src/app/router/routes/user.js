module.exports.user = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.user) {
                return res.redirect('/login');
            }
            callback(null);
        }

    ], function (err, result) {
        if (req.headers['xhr']) {
            res.send(result);
        } else {
            res.render('user/index');
        }
    });
};