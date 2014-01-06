(function() {

    'use strict';

    var app = angular.module('regidiumApp', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'angular-flash.service',
        'angular-flash.flash-alert-directive',
        'chieffancypants.loadingBar',
        'angular-underscore',
        'regidiumApp.commonDirectives',
        'regidiumApp.mainDirectives'
    ]).config(['$locationProvider', '$routeProvider', 'flashProvider', function($locationProvider, $routeProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: 'js/app/main/views/index.html', controller: MainCtrl })
            .when('/login', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthLoginCtrl })
            .when('/register', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthRegisterCtrl })
            .when('/auth/external/service/:provider/connect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceConnectCtrl })
            .when('/auth/external/service/:provider/disconnect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceDisconnectCtrl })
            .otherwise({ redirectTo: '/' });

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($http) {
        $http.defaults.headers.common.xhr = true;
    });

})();