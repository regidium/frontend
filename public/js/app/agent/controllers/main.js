'use strict';

function AgentMenuCtrl($rootScope, $scope, socket, sound) {
    $scope.new_messages = {};

    socket.emit('widget:message:new:get', {
        widget_uid: $rootScope.widget.uid
    });

    // Event сервер вернул список непрочитанных сообщений
    socket.on('widget:message:new:list', function (data) {
        console.log('Socket widget:message:new:list');

        $scope.new_messages = data.new_messages;
        $scope.new_messages_count = Object.keys($scope.new_messages).length;
    });

    // Пользователь написал сообщение
    socket.on('chat:message:sended:user', function (data) {
        console.log('Socket chat:message:sended:user');

        /** @todo выбрать звук для уведомления */
        //sound.play('beep');
        $scope.new_messages[data.message.uid] = data.message.uid;
        $scope.new_messages_count = Object.keys($scope.new_messages).length;
    });

    // Агент прочел сообщение
    socket.on('chat:message:readed:agent', function (data) {
        console.log('Socket chat:message:readed:agent', data);

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
            })
            .error(function(data, status, headers, config) {
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