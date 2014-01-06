var fs = require('fs');
var path = require('path');
var _ = require('underscore');

function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

fs.readdirSync(__dirname).forEach(function(file) {
    if (!file) {
        return;
    }

    var ext = getExtension(file);

    if (!ext) {
        return;
    }

    if (ext == 'json') {
        var routes = require('./' + file);
    }

    if (!routes) {
        return;
    }

    _.extend(module.exports, routes);
    _.extend(exports, routes);
});
