(function() {

    'use strict';

    var app = angular.module('regidiumApp', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'angular-flash.service',
        'angular-flash.flash-alert-directive',
        'chieffancypants.loadingBar',
        'angular-underscore'
    ]).config(['$locationProvider', '$routeProvider', 'flashProvider', function($locationProvider, $routeProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/user', { templateUrl: 'js/app/user/views/index.html', controller: UserCtrl })
            .otherwise({ redirectTo: '/agent' });

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($http) {
        $http.defaults.headers.common.xhr = true;
    });

})();