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
        'angularMoment',
        'angularFileUpload',
        'regidiumApp.commonDirectives'
    ]).config(function($locationProvider, $routeProvider, $translateProvider, $logProvider, flashProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/agent/logout', { templateUrl: 'js/app/agent/views/index.html', controller: AgentAuthLogoutCtrl })

            .when('/agent', { templateUrl: 'js/app/agent/views/index.html', controller: AgentCtrl })
            .when('/agent/issue', { templateUrl: 'js/app/agent/views/index.html', controller: AgentIssueCtrl })

            .when('/agent/visitors', { templateUrl: 'js/app/agent/views/visitors/index.html', controller: AgentVisitorsCtrl })
            .when('/agent/chats', { templateUrl: 'js/app/agent/views/chats/index.html', controller: AgentChatsCtrl })

            .when('/agent/agents/list', { templateUrl: 'js/app/agent/views/agents/index.html', controller: AgentAgentsCtrl })

            .when('/agent/settings/widget/style', { templateUrl: 'js/app/agent/views/settings/widget/style.html', controller: AgentSettingsWidgetStyleCtrl })
            .when('/agent/settings/widget/code', { templateUrl: 'js/app/agent/views/settings/widget/code.html', controller: AgentSettingsWidgetCodeCtrl })
            .when('/agent/settings/triggers', { templateUrl: 'js/app/agent/views/settings/triggers.html', controller: AgentSettingsTriggersCtrl })
            
            .when('/agent/balance/payment', { templateUrl: 'js/app/agent/views/balance/payment.html', controller: AgentBalancePaymentCtrl })
            .when('/agent/balance/payment/success', { templateUrl: 'js/app/agent/views/balance/payment.html', controller: AgentBalancePaymentSuccessCtrl })
            .when('/agent/balance/payment/fail', { templateUrl: 'js/app/agent/views/balance/payment.html', controller: AgentBalancePaymentFailCtrl })
            .when('/agent/balance/plan', { templateUrl: 'js/app/agent/views/balance/plan.html', controller: AgentBalancePlanCtrl })
            
            .when('/agent/reports/statistics', { templateUrl: 'js/app/agent/views/report/statistics.html', controller: AgentReportStatisticsCtrl })
            .when('/agent/reports/history', { templateUrl: 'js/app/agent/views/report/history.html', controller: AgentReportHistoryCtrl })

            .otherwise({ redirectTo: '/agent' });

        // Настраиваем переводчик
        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/agent/translations/',
            suffix: '.json'
        });

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        // Выводим сообщения в консоль только для окружения разработки
        if (env == 'development') {
            $logProvider.debugEnabled(true);
            $translateProvider.useMissingTranslationHandlerLog();
        }

        // Настраиваем классы всплывающих сообщений
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');
    }).run(function($rootScope, $cookieStore, $translate, $http, $location, amMoment, config, socket, flash, sound) {
        $rootScope.location = $location;

        $rootScope.env = env || 'production';

        $http.defaults.headers.common.xhr = true;

        // Определяем язык браузера
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        lang = lang.substring(0, 2);
        $rootScope.lang = lang;

        amMoment.changeLanguage(lang);

        /** @todo убрать в сервис */
        $rootScope.getOsClass = function(os_string) {
            if (os_string) {
                os_string = angular.lowercase(os_string);
                if (os_string.indexOf('linux') != -1) {
                    return 'fa-linux';
                } else if (os_string.indexOf('windows') != -1) {
                    return 'fa-windows';
                } else if (os_string.indexOf('apple') != -1 || os_string.indexOf('ios') != -1) {
                    return 'fa-apple';
                } else if (os_string.indexOf('osx') != -1) {
                    return 'fa-apple';
                } else if (os_string.indexOf('android') != -1) {
                    return 'fa-android';
                } else {
                    return '';
                }
            }
        };

        /** @todo убрать в сервис */
        $rootScope.getBrowserClass = function(browser_string) {
            if (browser_string) {
                browser_string = angular.lowercase(browser_string)
                if (browser_string.indexOf('chrome') != -1) {
                    return 'icon-chrome';
                } else if (browser_string.indexOf('firefox') != -1) {
                    return 'icon-firefox';
                } else if (browser_string.indexOf('opera') != -1) {
                    return 'icon-opera';
                } else if (browser_string.indexOf('internet explorer') != -1 || browser_string.indexOf('ie') != -1) {
                    return 'icon-ie';
                } else {
                    return '';
                }
            }
        };

        // Получаем агента из cookie или отправляем на страницу авторизации
        $rootScope.agent = $cookieStore.get('agent');
        if ($rootScope.agent) {
            if ($rootScope.agent.first_name) {
                $rootScope.agent.first_name = decodeURIComponent($rootScope.agent.first_name);
            } else {
                $rootScope.agent.first_name = '';
            }

            if ($rootScope.agent.last_name) {
                $rootScope.agent.last_name = decodeURIComponent($rootScope.agent.last_name);
            } else {
                $rootScope.agent.last_name = '';
            }

            if ($rootScope.agent.job_title) {
                $rootScope.agent.job_title = decodeURIComponent($rootScope.agent.job_title);
            } else {
                $rootScope.agent.job_title = '';
            }
        } else {
            window.location = '/login';
        }

        if ($rootScope.agent.language != 'auto') {
            $rootScope.lang = $rootScope.agent.language;
            $translate.uses($rootScope.agent.language);
        }

        var getSession = function(cb) {
            var session_data = {};
            session_data.device = UAParser('').device.model + ' ' + UAParser('').device.vendor;
            session_data.os = UAParser('').os.name;
            session_data.browser = UAParser('').browser.name + ' ' + UAParser('').browser.version;
            session_data.language = $rootScope.lang;
            // Получаем IP, страну, город пользователя
            try {
                $http.jsonp('http://api.sypexgeo.net/jsonp/?callback=JSON_CALLBACK').success(function(data) {
                    // @todo можно определять timezone (http://sypexgeo.net/ru/api/)
                    session_data.ip = data.ip;
                    session_data.country = data.country.name_en;
                    session_data.city = data.city.name_en;
                    cb(session_data);
                });
            } catch(e) {
                $log.debug('Ошибка получения IP, страны, города');
                cb(session_data);
            }
        };

        getSession(function(session) {
            // Сообщяем слушателей о подключении агента
            socket.emit('agent:connect', { agent: $rootScope.agent, session: session, widget_uid: $rootScope.agent.widget.uid });
        });

        // Добавляем переменную widget в глобальный скоуп
        $rootScope.widget = $rootScope.agent.widget;

        // Константы
        $rootScope.c = {};

        $rootScope.c.AGENT_STATUS_ONLINE   = 1;
        $rootScope.c.AGENT_STATUS_OFFLINE  = 3;

        $rootScope.c.CHAT_STATUS_ONLINE   = 1;
        $rootScope.c.CHAT_STATUS_CHATTING = 2;
        $rootScope.c.CHAT_STATUS_OFFLINE  = 3;
        $rootScope.c.CHAT_STATUS_CLOSED   = 4;

        $rootScope.c.PAYMENT_METHOD_YANDEX_MONEY   = 1;
        $rootScope.c.PAYMENT_METHOD_CREDIT_CARD   = 2;

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

        $rootScope.t = (+new Date);
    }).constant('angularMomentConfig', {
        preprocess: 'unix',
        // @todo
        timezone: 'Europe/London'
    });

})(angular);