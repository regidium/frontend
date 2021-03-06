(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .controller('AgentMenuCtrl',AgentMenuCtrl)
        .controller('AgentAuthLogoutCtrl',AgentAuthLogoutCtrl)
        .controller('AgentCtrl',AgentCtrl)
        .controller('AgentIssueCtrl',AgentIssueCtrl);

    function AgentMenuCtrl($rootScope, $scope, $log, $translate, socket, sound, flash) {
        var soundBeep = sound.init('beep');

        $scope.new_messages = {};

        socket.emit('widget:message:new:get', {
            widget_uid: $rootScope.widget.uid
        });

        // Event сервер вернул список непрочитанных сообщений
        socket.on('widget:message:new:list', function (data) {
            $log.debug('Socket widget:message:new:list');

            $scope.new_messages = data.new_messages;
            $scope.new_messages_count = Object.keys($scope.new_messages).length;
        });

        // Пользователь написал сообщение
        socket.on('chat:message:add:new', function (data) {
            $log.debug('Main', 'Socket chat:message:add:new');

            flash.warn = $translate('User send message') + ': ' + data.message.text;

            /** @todo выбрать звук для уведомления */
            soundBeep.play();
            $scope.new_messages[data.message.uid] = data.message.uid;
            $scope.new_messages_count = Object.keys($scope.new_messages).length;
        });

        // Агент прочел сообщение
        socket.on('chat:message:remove:new', function (data) {

            delete $scope.new_messages[data.message_uid];
            $scope.new_messages_count = Object.keys($scope.new_messages).length;
        });

        // Чат подключен
        socket.on('chat:created', function (data) {
            flash.warn = $translate('User') + ' ' + data.chat.user.ip + ', ' + data.chat.user.city + ', ' + data.chat.user.first_name  + ' ' + $translate('visited site');
        });

        // Чат подключен
        socket.on('chat:connected', function (data) {
            flash.warn = $translate('User') + ' ' + data.chat.user.ip + ', ' + data.chat.user.city + ', ' + data.chat.user.first_name  + ' ' + $translate('back to site');
        });

        // Чат отключен
        socket.on('chat:disconnect', function (data) {
            flash.warn = $translate('User left site');
        });
    }

    /**
     * @url "/logout"
     */
    function AgentAuthLogoutCtrl($scope, $http) {
        // Нажатие кнопки Logout
        $scope.logout = function() {
            // Запрос на отключение агента
            $http.get('/logout')
                .success(function(data, status, headers, config) {
                    // Оповещаем об отключении агента
                    //socket.emit('agent:disconnect', { agent_uid: $rootScope.agent.uid, widget_uid: $rootScope.agent.widget_uid });
                    window.location = '/';
                }).error(function(data, status, headers, config) {
                    window.location = '/';
                });
        };
    }

    /**
     * @url "/agent"
     */
    function AgentCtrl($rootScope, $scope, socket) {

        // Event сервер прислала информацию о виджете
        socket.on('widget:info:sended', function(data) {
            // Добавляем переменную widget в глобальный scope
            $rootScope.widget.notifications = data.notifications;
            $rootScope.notifications = JSON.parse(localStorage.getItem('notifications'));
            if (!$rootScope.notifications) {
                $rootScope.notifications = {};
            }

            angular.forEach($rootScope.widget.notifications, function(notification) {
                if (!$rootScope.notifications[notification.key]) {
                    $rootScope.notifications[notification.key] = notification;
                }
            });

            $rootScope.notificationsShow = true;
        });

        $scope.closeNotification = function(notification) {
            $rootScope.notifications[notification.key].show = false;
            localStorage.setItem('notifications', JSON.stringify($rootScope.notifications));
        };
    }

    /**
     * @url "/agent/issue"
     */
    function AgentIssueCtrl($rootScope, $scope, $location, $translate, socket, flash) {
        if ($location.path() === '/agent/issue') {
            angular.element('#issue').modal('show');
        }

        $scope.send = function() {
            socket.emit('agent:issue:send', { issue: $scope.issue, agent_uid: $rootScope.agent.uid });
            $scope.issue = {title: '', text: ''};

            flash.success = $translate('Issue sended');

            angular.element('#issue').modal('hide');

            $location.path('/agent');
        };

        $scope.close = function() {
            $location.path('/agent');
        };
    }

})(angular);