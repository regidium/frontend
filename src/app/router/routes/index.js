module.exports.index = function (req, res) {
    if (req.person && req.person.model_type == 'person') {
        return res.redirect('/agent');
    } else {
        return res.render('main/index');
    }
};