module.exports.index = function (req, res) {
    if (req.person && req.person.uid) {
        return res.redirect('/agent');
    } else {
        return res.render('main/index');
    }
};