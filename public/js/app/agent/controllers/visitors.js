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
function AgentVisitorsCtrl($scope, $cookieStore, $location, socket, flash, blockUI) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;
    // Определяем блоки блокировки
    var visitorsBlockUI = blockUI.instances.get('visitorsBlockUI');

    $scope.chats = {};

    $scope.current_chat = {};

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: widget_uid, agent_uid: $scope.agent.uid });
    // Блокируем ожидающие блоки
    visitorsBlockUI.start();

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        console.log('Socket chat:existed:list');

        // Наполняем список чатов
        angular.forEach(data, function(chat) {
            $scope.chats[chat.uid] = chat;
        });

        // Разблокировка ожидающих блоков
        visitorsBlockUI.stop(); 
    });

    // Event сервер оповестил о необходимости обновить список пользователей
    socket.on('service:update:users:list', function (data) {
        console.log('Socket service:update:users:list');

        // Запрашиваем список чатов
        socket.emit('chat:existed', { widget_uid: widget_uid, agent_uid: $scope.agent.uid });
        // Блокируем ожидающие блоки
        visitorsBlockUI.start();
    });

    // Пользователь изменил авторизационные данные
    socket.on('chat:user:authed', function (data) {
        console.log('Socket chat:user:authed');

        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].user = data.user;
        }
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected');

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data.chat;
    });

    // Чат отключен
    socket.on('chat:disconnect', function (data) {
        console.log('Socket chat:disconnect');

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat = {};
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
        // Устанавливеам текущий URL
        $location.path('/agent/chats');
        // Подключаем агента к чату
        socket.emit('chat:agent:enter', {
            agent: $scope.agent,
            chat: current_chat,
            widget_uid: widget_uid
        });
    }

    /** @todo убрать в сервис */
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