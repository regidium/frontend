module.exports = function(app) {

    app.get('/agent', function(req, res) {
        res.render('agent/index');
    });

    return this;
};