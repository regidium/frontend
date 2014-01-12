(function(angular) {

    'use strict';

    var app = angular.module('regidiumApp', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'pascalprecht.translate',
        'angular-flash.service',
        'angular-flash.flash-alert-directive',
        'chieffancypants.loadingBar',
        'angular-underscore',
        'regidiumApp.commonDirectives',
        'regidiumApp.mainDirectives'
    ]).config(['$locationProvider', '$routeProvider', '$translateProvider', 'flashProvider', function($locationProvider, $routeProvider, $translateProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: 'js/app/main/views/index.html', controller: MainCtrl })
            .when('/login', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthLoginCtrl })
            .when('/register', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthRegisterCtrl })
            .when('/auth/external/service/:provider/connect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceConnectCtrl })
            .when('/auth/external/service/:provider/disconnect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceDisconnectCtrl })
            .otherwise({ redirectTo: '/' });

        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/main/translations/',
            suffix: '.json'
        });

        $translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($http, $rootScope, $translate) {
        $http.defaults.headers.common.xhr = true;
        /** @todo форматировать языки (ru_RU в ru) */
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        $rootScope.lang = lang;
        $translate.uses(lang);
    });

})(angular);