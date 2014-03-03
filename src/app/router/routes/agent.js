module.exports.agent = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.person && req.person.uid) {
                callback(null);
            } else {
                return res.redirect('/login');
            }
        }

    ], function (err, result) {
        if (req.headers['xhr']) {
            res.send(result);
        } else {
            res.render('agent/index');
        }
    });
};