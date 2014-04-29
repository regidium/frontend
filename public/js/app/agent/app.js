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
        'ui.bootstrap',
        'angular-underscore',
        'blockUI',
        'regidiumApp.commonDirectives'
    ]).config(['$locationProvider', '$routeProvider', '$translateProvider', 'flashProvider', function($locationProvider, $routeProvider, $translateProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/logout', { templateUrl: 'js/app/agent/views/index.html', controller: AgentAuthLogoutCtrl })
            .when('/agent', { templateUrl: 'js/app/agent/views/index.html', controller: AgentCtrl })
            .when('/agent/chats', { templateUrl: 'js/app/agent/views/chats/index.html', controller: AgentChatsCtrl })
            .when('/agent/agents', { templateUrl: 'js/app/agent/views/agents/index.html', controller: AgentAgentsCtrl })
            .when('/agent/visitors', { templateUrl: 'js/app/agent/views/visitors/index.html', controller: AgentVisitorsCtrl })
            .when('/agent/archives', { templateUrl: 'js/app/agent/views/archives/index.html', controller: AgentArchivesCtrl })
            .when('/agent/settings', { templateUrl: 'js/app/agent/views/settings/index.html', controller: AgentSettingsCtrl })
            .when('/agent/settings/widget', { templateUrl: 'js/app/agent/views/settings/widget/index.html', controller: AgentSettingsWidgetCtrl })
            .when('/agent/settings/widget/style', { templateUrl: 'js/app/agent/views/settings/widget/style.html', controller: AgentSettingsWidgetStyleCtrl })
            .when('/agent/settings/widget/triggers', { templateUrl: 'js/app/agent/views/settings/widget/triggers.html', controller: AgentSettingsWidgetTriggersCtrl })
            .when('/agent/settings/widget/code', { templateUrl: 'js/app/agent/views/settings/widget/code.html', controller: AgentSettingsWidgetCodeCtrl })
            .when('/agent/settings/widget/pay', { templateUrl: 'js/app/agent/views/settings/widget/pay.html', controller: AgentSettingsWidgetPayCtrl })
            .when('/agent/settings/widget/plan', { templateUrl: 'js/app/agent/views/settings/widget/plan.html', controller: AgentSettingsWidgetPlanCtrl })
            .when('/agent/settings/productivity', { templateUrl: 'js/app/agent/views/settings/productivity.html', controller: AgentSettingsProductivityCtrl })
            .when('/agent/statistics', { templateUrl: 'js/app/agent/views/statistics/index.html', controller: AgentStatisticsCtrl })
            /*.when('/agent/chat/:uid', { templateUrl: 'js/app/agent/views/chats/chat.html', controller: AgentChatCtrl })*/
            .otherwise({ redirectTo: '/agent' });

        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/main/translations/',
            suffix: '.json'
        });

        if (env == 'development') {
            $translateProvider.useMissingTranslationHandlerLog();
        }

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($rootScope, $cookieStore, $translate, $http, config, socket, flash, sound) {
        $rootScope.env = env || 'production';

        $http.defaults.headers.common.xhr = true;

        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        lang = lang.substring(0, 2);
        $rootScope.lang = lang;
        $translate.uses(lang);

        $rootScope.log = function(text) {
            if ($rootScope.env) {
                console.log(text);
            }
        }

        $rootScope.agent = $cookieStore.get('agent');
        if ($rootScope.agent) {
            $rootScope.agent.first_name = decodeURIComponent($rootScope.agent.first_name);
            $rootScope.agent.last_name = decodeURIComponent($rootScope.agent.last_name);
            $rootScope.agent.job_title = decodeURIComponent($rootScope.agent.job_title);
        } else {
            window.location = '/login';
        }
        socket.emit('agent:connect', { agent: $rootScope.agent, widget_uid: $rootScope.agent.widget.uid });
        $rootScope.widget = $rootScope.agent.widget;

        // Константы
        $rootScope.c = {};

        $rootScope.c.CHAT_STATUS_ONLINE   = 1;
        $rootScope.c.CHAT_STATUS_CHATTING = 2;
        $rootScope.c.CHAT_STATUS_OFFLINE  = 3;
        $rootScope.c.CHAT_STATUS_ARCHIVED = 4; // @depricated
        $rootScope.c.CHAT_STATUS_DELETED  = 5; // @depricated

        $rootScope.c.TRIGGER_EVENT_WIDGET_CREATED = 1;
        $rootScope.c.TRIGGER_EVENT_WORD_SEND = 2;
        $rootScope.c.TRIGGER_EVENT_TIME_ONE_PAGE = 3;
        $rootScope.c.TRIGGER_EVENT_VISIT_PAGE = 4;
        $rootScope.c.TRIGGER_EVENT_VISIT_FROM_URL = 5;
        $rootScope.c.TRIGGER_EVENT_VISIT_FROM_KEY_WORD = 6;
        $rootScope.c.TRIGGER_EVENT_CHAT_OPENED = 7;
        $rootScope.c.TRIGGER_EVENT_CHAT_CLOSED = 8;
        $rootScope.c.TRIGGER_EVENT_MESSAGE_START = 9;
        $rootScope.c.TRIGGER_EVENT_MESSAGE_SEND = 10;

        $rootScope.c.TRIGGER_RESULT_MESSAGE_SEND = 1;
        $rootScope.c.TRIGGER_RESULT_AGENTS_ALERT = 2;
        $rootScope.c.TRIGGER_RESULT_WIDGET_OPEN = 3;
        $rootScope.c.TRIGGER_RESULT_WIDGET_BELL = 4;

        $rootScope.c.MESSAGE_SENDER_TYPE_USER = 1;
        $rootScope.c.MESSAGE_SENDER_TYPE_AGENT = 2;
        $rootScope.c.MESSAGE_SENDER_TYPE_ROBOT = 3;
    });

})(angular);