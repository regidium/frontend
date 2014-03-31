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

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($scope, $cookieStore, $location, socket, flash, Users, Widgets) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;

    $scope.chats = {};

    $scope.current_chat = {};

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: widget_uid });

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        console.log('Socket chat:existed:list');

        // Наполняем список чатов
        angular.forEach(data, function(chat) {
            $scope.chats[chat.chat.uid] = chat;
        });
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected');

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data;
    });

    // Чат отключен
    socket.on('chat:disconnected', function (data) {
        console.log('Socket chat:disconnected', data);

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.chat.uid == data.chat_uid) {
            $scope.current_chat = {};
        }

        // Переносим чат из списка чатов онлайн в список покинувших сайт
        console.log($scope.chats[data.chat_uid]);
        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].chat.status = 3;
        }
    });

    // Пользователь закрыл чат
    /** @todo */
    socket.on('chat:ended', function (data) {
        console.log('Socket chat:ended');
    });

    // Выбор чата
    $scope.selectChat = function(chat) {
        // Устанавливеам текущий выбранный чат
        $scope.current_chat = chat;
    }

    // Начало чата с пользователем
    $scope.startChat = function(current_chat) {
        // Устанавливеам текущий ULR
        $location.path('/agent/chats');
        // Подключаем агента к чату
        socket.emit('chat:agent:enter', { agent: $scope.agent, chat_uid: current_chat.chat.uid, widget_uid: widget_uid });
    }
}