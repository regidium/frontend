var yamoney = require('yamoney');

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

module.exports.payment = function (req, res) {
    res.async.waterfall([

        function (callback) {
            if (req.agent && req.agent.uid) {
                callback(null);
            } else {
                return res.redirect('/login');
            }
        }

    ], function (err, result) {
        var client = new yamoney.Client({token: 'EBBB93A0EC2E849F3955D7452C39E76FA03436BA64679E61F421621F668FAA3F'});
        client.accountInfo(function(err, info) {
            console.log(err, info);
        });
//        if (req.xhr || req.headers['xhr']) {
//            res.send(result);
//        } else {
//            res.render('agent/index');
//        }
    });
};