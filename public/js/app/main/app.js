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
        'blockUI',
        'regidiumApp.commonDirectives'
    ]).config(function($locationProvider, $routeProvider, $translateProvider, $logProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', { templateUrl: 'js/app/main/views/index.html', controller: MainCtrl })
            .when('/login', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthLoginCtrl })
            .when('/registration', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthRegistrationCtrl })
            .when('/auth/external/service/:provider/connect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceConnectCtrl })
            .when('/auth/external/service/:provider/disconnect', { templateUrl: 'js/app/main/views/index.html', controller: MainAuthExternalServiceDisconnectCtrl })
            .otherwise({ redirectTo: '/' });

        // Настраиваем переводчик
        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/main/translations/',
            suffix: '.json'
        });
        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        // Выводим сообщения в консоль только для окружения разработки
        if (env == 'development') {
            $translateProvider.useMissingTranslationHandlerLog();
            $logProvider.debugEnabled(true);
        }

        // Настраиваем классы всплывающих сообщений
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }).run(function($http, $rootScope, $translate) {
        $rootScope.env = env || 'production';

        $http.defaults.headers.common.xhr = true;

        // Определяем язык браузера
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        lang = lang.substring(0, 2);
        $rootScope.lang = lang;
        $translate.uses(lang);
    });
})(angular);