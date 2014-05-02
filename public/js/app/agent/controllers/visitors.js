'use strict';

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($rootScope, $scope, $location, $log, socket, flash, blockUI) {
    // Определяем блоки блокировки
    var visitorsBlockUI = blockUI.instances.get('visitorsBlockUI');

    $scope.chats = {};

    $scope.current_chat = {};

    // ================================================================

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: $rootScope.widget.uid, agent_uid: $rootScope.agent.uid });

    // Блокируем ожидающие блоки
    visitorsBlockUI.start();

    // Изменен URL чата
    socket.on('chat:url:change', function (data) {
        $log.debug('Socket chat:url:change', data);

        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].current_url = data.new_url;
        }

        if ($scope.current_chat && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat.current_url = data.new_url;
        }
    });

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        $log.debug('Socket chat:existed:list');

        // Наполняем список чатов
        angular.forEach(data, function(chat) {
            chat.current_url = decodeURIComponent(chat.current_url);

            $scope.chats[chat.uid] = chat;
        });

        // Разблокировка ожидающих блоков
        visitorsBlockUI.stop(); 
    });

    // Event сервер оповестил о необходимости обновить список пользователей
    socket.on('service:update:users:list', function (data) {
        $log.debug('Socket service:update:users:list');

        // Запрашиваем список чатов
        socket.emit('chat:existed', { widget_uid: $rootScope.widget.uid, agent_uid: $rootScope.agent.uid });
        // Блокируем ожидающие блоки
        visitorsBlockUI.start();
    });

    // Пользователь изменил авторизационные данные
    socket.on('chat:user:authed', function (data) {
        $log.debug('Socket chat:user:authed');

        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].user = data.user;
        }
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        $log.debug('Socket chat:connected');

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data.chat;
    });

    // Чат отключен
    socket.on('chat:disconnect', function (data) {
        $log.debug('Socket chat:disconnect');

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat = {};
        }

        // Переносим чат из списка чатов онлайн в список покинувших сайт
        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].status = $rootScope.c.CHAT_STATUS_OFFLINE;
        }
    });

    // Пользователь закрыл чат
    /** @todo */
    socket.on('chat:ended', function (data) {
        $log.debug('Socket chat:ended');
    });

    // ================================================================

    // Выбор чата
    $scope.selectChat = function(chat) {
        // Устанавливеам текущий выбранный чат
        $scope.current_chat = chat;
        if ($scope.current_chat.current_url) {
            $scope.current_chat.current_url = decodeURIComponent($scope.current_chat.current_url);
        }
    }

    // Начало чата с пользователем
    $scope.startChat = function(current_chat) {
        // Устанавливеам текущий URL
        $location.path('/agent/chats');
        // Подключаем агента к чату
        socket.emit('chat:agent:enter', {
            agent: $rootScope.agent,
            chat: current_chat,
            widget_uid: $rootScope.widget.uid
        });
    }
}