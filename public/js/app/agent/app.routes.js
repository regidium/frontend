/**
 *  Agent application routes
 */
(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .config(routes)

    function routes($locationProvider, $routeProvider){

        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/agent/logout', {
                templateUrl: 'js/app/agent/views/index.html',
                controller: AgentAuthLogoutCtrl
            })

            .when('/agent', {
                templateUrl: 'js/app/agent/views/index.html',
                controller: AgentCtrl
            })
            .when('/agent/issue', {
                templateUrl: 'js/app/agent/views/index.html',
                controller: AgentIssueCtrl
            })

            .when('/agent/visitors', {
                templateUrl: 'js/app/agent/views/visitors/index.html',
                controller: AgentVisitorsCtrl
            })
            .when('/agent/chats', {
                templateUrl: 'js/app/agent/views/chats/index.html',
                controller: AgentChatsCtrl
            })

            .when('/agent/agents/list', {
                templateUrl: 'js/app/agent/views/agents/index.html',
                controller: AgentAgentsCtrl
            })

            .when('/agent/settings/widget/style', {
                templateUrl: 'js/app/agent/views/settings/widget/style.html',
                controller: AgentSettingsWidgetStyleCtrl
            })
            .when('/agent/settings/widget/code', {
                templateUrl: 'js/app/agent/views/settings/widget/code.html',
                controller: AgentSettingsWidgetCodeCtrl
            })
            .when('/agent/settings/triggers', {
                templateUrl: 'js/app/agent/views/settings/triggers.html',
                controller: AgentSettingsTriggersCtrl
            })

            .when('/agent/balance/payment', {
                templateUrl: 'js/app/agent/views/balance/payment.html',
                controller: AgentBalancePaymentCtrl
            })
            .when('/agent/balance/payment/success', {
                templateUrl: 'js/app/agent/views/balance/payment.html',
                controller: AgentBalancePaymentSuccessCtrl
            })
            .when('/agent/balance/payment/fail', {
                templateUrl: 'js/app/agent/views/balance/payment.html',
                controller: AgentBalancePaymentFailCtrl
            })
            .when('/agent/balance/plan', {
                templateUrl: 'js/app/agent/views/balance/plan.html',
                controller: AgentBalancePlanCtrl
            })

            .when('/agent/reports/statistics', {
                templateUrl: 'js/app/agent/views/report/statistics.html',
                controller: AgentReportStatisticsCtrl
            })
            .when('/agent/reports/history', {
                templateUrl: 'js/app/agent/views/report/history.html',
                controller: AgentReportHistoryCtrl
            })

            .otherwise({ redirectTo: '/agent' })
        ;
    }

})(angular);