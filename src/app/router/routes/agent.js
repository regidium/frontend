module.exports.agent = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (!req.agent) {
                return res.redirect('/login');
            }
            callback(null);
        }

    ], function (err, result) {
        if (req.headers['xhr']) {
            res.send(result);
        } else {
            res.render('agent/index');
        }
    });
};