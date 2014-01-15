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
        'regidiumApp.commonDirectives'
    ]).config(['$locationProvider', '$routeProvider', '$translateProvider', 'flashProvider', function($locationProvider, $routeProvider, $translateProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/logout', { templateUrl: 'js/app/user/views/index.html', controller: UserAuthLogoutCtrl })
            .when('/user', { templateUrl: 'js/app/user/views/index.html', controller: UserCtrl })
            .when('/user/chat', { templateUrl: 'js/app/user/views/chat/index.html', controller: UserChatCtrl })
            .when('/user/settings', { templateUrl: 'js/app/user/views/settings/index.html', controller: UserSettingsCtrl })
            .otherwise({ redirectTo: '/user' });

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
    }]).run(function($rootScope, $cookieStore, $translate, config, socket) {
        /** @todo форматировать языки (ru_RU в ru) */
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        $rootScope.lang = lang;
        $translate.uses(lang);

        socket.emit('user:connected', $cookieStore.get('user') );
    });

})(angular);