'use strict';

function security($cookieStore) {
    var person = $cookieStore.get('person');

    if (person) {
        person.fullname = decodeURIComponent(person.fullname);
        return person;
    }

    window.location = '/login';
}

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($scope, $cookieStore, $location, socket, flash, Users, Widgets) {
    // Получаем агента из cookie
    $scope.person = security($cookieStore);
    var widget_uid = $scope.person.agent.widget.uid;

    $scope.chats = {};

    $scope.current_chat = {};

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: widget_uid });

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        console.log('Socket chat:existed:list', data);

        // Наполняем список чатов
        $scope.chats = data;
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected', data);

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data;
    });

    // Чат отключен
    socket.on('chat:disconnected', function (data) {
        console.log('Socket chat:disconnected', data);

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.chat.uid == data.chat_uid) {
            $scope.current_chat = {};
        }

        // Удаляем чат из списка чатов онлайн
        delete $scope.chats[data.chat_uid];
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
        socket.emit('chat:agent:enter', { person: $scope.person, chat_uid: current_chat.chat.uid, widget_uid: widget_uid });
    }
}