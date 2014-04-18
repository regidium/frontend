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

        /** @todo включить для перевода */
        //$translateProvider.useMissingTranslationHandlerLog();

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }]).run(function($rootScope, $cookieStore, $translate, config, socket, flash) {
        /** @todo форматировать языки (ru_RU в ru) */
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        $rootScope.lang = lang;
        $translate.uses(lang);

        var agent = $cookieStore.get('agent');
        socket.emit('agent:connect', { agent: agent, widget_uid: agent.widget.uid });

        $rootScope.chatting = {};
        $rootScope.chatting_count = 0;

        // Оповещание о новом чате
        socket.on('chat:connected', function (data) {
            console.log('Socket chat:connected');
            if (data.chat.status == 2 && !data.chat.agent) {
                $rootScope.chatting[data.chat.uid] = data.chat.uid;
                $rootScope.chatting_count = Object.keys($rootScope.chatting).length;
            }
        });
        // Оповещание о закрытии чата
        socket.on('chat:disconnected', function (data) {
            console.log('Socket chat:disconnected');

            delete $rootScope.chatting[data.chat_uid];
            $rootScope.chatting_count = Object.keys($rootScope.chatting).length;
        });
        // Агент подключился к чату
        socket.on('chat:agent:entered', function (data) {
            console.log('Socket chat:agent:entered', data);

            delete $rootScope.chatting[data.chat.uid];
            $rootScope.chatting_count = Object.keys($rootScope.chatting).length;
        });
    });

})(angular);