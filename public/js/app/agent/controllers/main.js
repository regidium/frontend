'use strict';

function AgentMenuCtrl($rootScope, $scope, $log, socket, sound) {
    //var soundBeep = sound.init('beep');
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

        /** @todo выбрать звук для уведомления */
        //soundBeep.play();
        $scope.new_messages[data.message.uid] = data.message.uid;
        $scope.new_messages_count = Object.keys($scope.new_messages).length;
    });

    // Агент прочел сообщение
    socket.on('chat:message:remove:new', function (data) {
        $log.debug('Main', 'Socket chat:message:remove:new', data);

        delete $scope.new_messages[data.message_uid];
        $scope.new_messages_count = Object.keys($scope.chatting).length;
    });
};

/**
 * @url "/logout"
 */
function AgentAuthLogoutCtrl($rootScope, $scope, $http, socket) {
    // Нажатие кнопки Logout
    $scope.logout = function() {
        // Оповещаем об отключении агента
        socket.emit('agent:disconnect', { agent_uid: $rootScope.agent.uid });

        // Запрос на отключение агента
        $http.get('/logout')
            .success(function(data, status, headers, config) {
                window.location = '/';
            }).error(function(data, status, headers, config) {
                window.location = '/';
            });
    }
}

/**
 * @url "/agent"
 */
function AgentCtrl($scope) {
    /** @todo */
};