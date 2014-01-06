var self = module.exports;

self.index = function (req, res) {
    if (req.agent) {
        return res.redirect('/agent');
    } else if (req.user) {
        return res.redirect('/user');
    } else {
        return res.render('main/index');
    }
};