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
function AgentVisitorsCtrl($scope, $cookieStore, $location, socket, flash) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;

    $scope.chats = {};

    $scope.current_chat = {};

    $scope.counter = {
        online: 0,
        chatting: 0,
        offline: 0
    };

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: widget_uid });

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        console.log('Socket chat:existed:list');

        // Наполняем список чатов
        angular.forEach(data, function(chat) {
            if (chat.status == 1) {
                $scope.counter.online = $scope.counter.online + 1;
            } else if (chat.status == 2) {
                $scope.counter.chatting = $scope.counter.chatting + 1;
            } else if (chat.status == 3) {
                $scope.counter.offline = $scope.counter.offline + 1;
            }

            $scope.chats[chat.uid] = chat;
        });
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected');

        if (data.chat.status == 1) {
            $scope.counter.online = $scope.counter.online + 1;
        } else if (data.chat.status == 2) {
            $scope.counter.chatting = $scope.counter.chatting + 1;
        } else if (data.chat.status == 3) {
            $scope.counter.offline = $scope.counter.offline + 1;
        }

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data;
    });

    // Чат отключен
    socket.on('chat:disconnected', function (data) {
        console.log('Socket chat:disconnected');

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat = {};
        }

        if ($scope.chats[data.chat_uid].status == 1) {
            $scope.counter.online = $scope.counter.online - 1;
        } else if ($scope.chats[data.chat_uid].status == 2) {
            $scope.counter.chatting = $scope.counter.chatting - 1;
        } else if ($scope.chats[data.chat_uid].status == 3) {
            $scope.counter.offline = $scope.counter.offline - 1;
        }

        // Переносим чат из списка чатов онлайн в список покинувших сайт
        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].status = 3;
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
        socket.emit('chat:agent:enter', { agent: $scope.agent, chat_uid: current_chat.uid, widget_uid: widget_uid });
    }

    $scope.getOsClass = function(os_string) {
        if (os_string && os_string.indexOf('inux') != -1) {
            return 'fa-linux';
        } else if (os_string && os_string.indexOf('indows') != -1) {
            return 'fa-windows';
        } else if (os_string && os_string.indexOf('pple') != -1) {
            return 'fa-apple';
        } else if (os_string && os_string.indexOf('ndroid') != -1) {
            return 'fa-android';
        } else {
            return 'fa-square-o';
        }
    }
}