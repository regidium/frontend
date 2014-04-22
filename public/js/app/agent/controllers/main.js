'use strict';

function security($cookieStore) {
    var agent = $cookieStore.get('agent');

    if (agent) {
        agent.first_name = decodeURIComponent(agent.first_name);
        agent.last_name = decodeURIComponent(agent.last_name);
        return agent;
    }

    window.location = '/login';
}

function AgentMenuCtrl($rootScope, $scope, $cookieStore, socket, sound) {
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;

    $scope.new_messages = {};

    socket.emit('chat:message:new:get', {
        widget_uid: widget_uid
    });

    // Event сервер вернул список непрочитанных сообщений
    socket.on('chat:message:new:list', function (data) {
        console.log('Socket chat:message:new:list');

        $scope.new_messages = data.new_messages;
        $scope.new_messages_count = Object.keys($scope.new_messages).length;
    });

    // Пользователь написал сообщение
    socket.on('chat:message:sended:user', function (data) {
        console.log('Socket chat:message:sended:user');

        /** @todo выбрать звук для уведомления */
        //sound.play();
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
function AgentAuthLogoutCtrl($scope, $http, $cookieStore, socket) {
    // Получаем пользователя из cookie
    var agent = security($cookieStore);

    // Нажатие кнопки Logout
    $scope.logout = function() {
        // Оповещаем об отключении агента
        socket.emit('agent:disconnect', { agent_uid: agent.uid });

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
function AgentCtrl($scope, $cookieStore) {
    security($cookieStore);
    /** @todo */
};