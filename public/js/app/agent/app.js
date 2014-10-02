/**
 *  Agent application module
 */
(function(angular) {

    'use strict';

    angular.module('regidiumApp', [
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
    ])

    // removed { $location, $templateCache, flash, config, sound, config } dependencies
    .run(function($rootScope, $translate, $http, amMoment,
                  socket, cssHelper, cookieService,
                  langService, constantsService, sessionService) {

        // unused variables
        //$rootScope.location = $location;
        //$rootScope.trans = $translate;

        // debug variable
        //$rootScope.cou = 0;

        // Отключаем кэш шаблонов
        //$rootScope.$on('$routeChangeStart', function(event, next, current) {
        //    if (typeof(current) !== 'undefined'){
        //        $templateCache.remove(current.templateUrl);
        //    }
        //});
        
        $rootScope.env = env || 'production';

        $http.defaults.headers.common.xhr = true;

        // Получаем агента из cookie или отправляем на страницу авторизации
        $rootScope.agent = cookieService.getAgent();
        if (!$rootScope.agent) {
            window.location = '/login';
        }

        // Определяем язык
        $rootScope.lang = langService.getLang();
        amMoment.changeLanguage($rootScope.lang);
        $translate.uses($rootScope.lang);


        // bind scope helper functions with service
        $rootScope.getOsClass = cssHelper.getOsClass;
        $rootScope.getBrowserClass = cssHelper.getBrowserClass;

        // set widget global variable
        $rootScope.widget = $rootScope.agent.widget;

        sessionService.getSession(function(session) {

            // Сообщяем слушателей о подключении агента
            socket.emit('agent:connect', { agent: $rootScope.agent, session: session, widget_uid: $rootScope.agent.widget.uid });

            /**
             * Запрашиваем информацию о виджете
             */
            socket.emit('widget:info:get', {
                widget_uid: $rootScope.agent.widget.uid
            });

            // Event сервер прислала информацию о виджете
            socket.on('widget:info:sended', function(data) {
                // Добавляем переменную widget в глобальный scope
                $rootScope.widget = data;
            });
        });

        // Application global constants
        $rootScope.c = constantsService.getApplicationConstants();
        $rootScope.t = (+new Date);
    })

})(angular);