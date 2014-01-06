var _ = require('underscore');
var config = require('../../../config/config/config.json');
var routes = require('../../../config/routes/');

var controllers = {};
var requireController = function (name) {
    if (controllers[name]) {
        return controllers[name];
    } else {
        return require('../../app/controllers/' + name);
    }
};

self = module.exports = function (app) {
    self.routes = routes;

    _.each(self.routes, function (route, name) {
        if (typeof(requireController(route.controller)[route.action]) == 'undefined') {
            console.error('Error: router ' + name + '. Controller ' + route.controller + ' or action ' + route.action + ' not exist!');
        }
        app[route.method](route.route, requireController(route.controller)[route.action]);
    });

    app.locals.path = function (name, parameters, absolute) {
        return self.path(name, parameters, absolute)
    }

    self.path = function (name, parameters, absolute) {
        var route = self.routes[name];
        if (route) {
            route = route.route;
            var question_mark_added = false;
            _.each(parameters, function (value, key) {
                if (route.indexOf(':' + key) != -1) route = route.replace(':' + key, value);
                else {
                    if (!value) return;
                    if (!question_mark_added) {
                        route += '?';
                        question_mark_added = true;
                    }
                    if (typeof(value) == 'object') {
                        _.each(value, function (value2, key2) {
                            route += key + '=' + value2;
                            route += '&';
                        });
                    } else {
                        route += key + '=' + value;
                        route += '&';
                    }
                }
            });
            if (absolute) {
                route = config.server.url + route;
            }

            if (route[(route.length - 1)] == '&') {
                route = route.substring(0, (route.length - 1));
            }

            return route;
        }

        console.error('Route ' + name + ' not found!');
        return null;
    };
};