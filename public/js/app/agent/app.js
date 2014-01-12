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
            .when('/logout', { templateUrl: 'js/app/agent/views/index.html', controller: AgentAuthLogoutCtrl })
            .when('/agent', { templateUrl: 'js/app/agent/views/index.html', controller: AgentCtrl })
            .when('/agent/users', { templateUrl: 'js/app/agent/views/users/index.html', controller: AgentUsersCtrl })
            .when('/agent/users/list', { templateUrl: 'js/app/agent/views/users/list.html', controller: AgentUsersListCtrl })
            .when('/agent/users/detail/:uid', { templateUrl: 'js/app/agent/views/users/form.html', controller: AgentUsersDetailCtrl })
            .when('/agent/users/edit/:uid', { templateUrl: 'js/app/agent/views/users/form.html', controller: AgentUsersEditCtrl })
            .when('/agent/agents', { templateUrl: 'js/app/agent/views/agents/index.html', controller: AgentAgentsCtrl })
            .when('/agent/agents/list', { templateUrl: 'js/app/agent/views/agents/list.html', controller: AgentAgentsListCtrl })
            .when('/agent/agents/detail/:uid', { templateUrl: 'js/app/agent/views/agents/form.html', controller: AgentAgentsDetailCtrl })
            .when('/agent/agents/create', { templateUrl: 'js/app/agent/views/agents/form.html', controller: AgentAgentsCreateCtrl })
            .when('/agent/agents/edit/:uid', { templateUrl: 'js/app/agent/views/agents/form.html', controller: AgentAgentsEditCtrl })
            .when('/agent/settings', { templateUrl: 'js/app/agent/views/settings/index.html', controller: AgentSettingsCtrl })
            .when('/agent/statistics', { templateUrl: 'js/app/agent/views/statistics/index.html', controller: AgentStatisticsCtrl })
            .when('/agent/chat', { templateUrl: 'js/app/agent/views/chat/index.html', controller: AgentChatCtrl })
            .otherwise({ redirectTo: '/agent' });

        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/main/translations/',
            suffix: '.json'
        });

        /** @todo включить для перевода */
        //$translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($http, $rootScope, $translate) {
        /** @todo форматировать языки (ru_RU в ru) */
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        $rootScope.lang = lang;
        $translate.uses(lang);

        $rootScope.apiUrl = 'http://api.regidium.loc/app_dev.php/api/v1/';
    });

})(angular);