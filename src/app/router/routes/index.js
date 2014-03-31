module.exports.index = function (req, res) {
    if (req.agent && req.agent.uid) {
        return res.redirect('/agent');
    } else {
        return res.render('main/index');
    }
};