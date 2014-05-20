module.exports.agent = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.agent && req.agent.uid) {
                callback(null);
            } else {
                return res.redirect('/login');
            }
        }

    ], function (err, result) {
        if (req.xhr || req.headers['xhr']) {
            res.send(result);
        } else {
            res.render('agent/index');
        }
    });
};