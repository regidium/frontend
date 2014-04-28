'use strict';

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($rootScope, $scope, $location, socket, flash, blockUI) {
    // Определяем блоки блокировки
    var visitorsBlockUI = blockUI.instances.get('visitorsBlockUI');

    $scope.chats = {};

    $scope.current_chat = {};

    // Запрашиваем список чатов
    socket.emit('chat:existed', { widget_uid: $rootScope.widget.uid, agent_uid: $rootScope.agent.uid });
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
        socket.emit('chat:existed', { widget_uid: $rootScope.widget.uid, agent_uid: $rootScope.agent.uid });
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
            $scope.chats[data.chat_uid].status = $rootScope.c.CHAT_STATUS_OFFLINE;
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
            agent: $rootScope.agent,
            chat: current_chat,
            widget_uid: $rootScope.widget.uid
        });
    }

    /** @todo убрать в сервис */
    $scope.getOsClass = function(os_string) {
        if (os_string) {
            os_string = os_string.toLowerCase()
            if (os_string.indexOf('linux') != -1) {
                return 'fa-linux';
            } else if (os_string.indexOf('windows') != -1) {
                return 'fa-windows';
            } else if (os_string.indexOf('apple') != -1) {
                return 'fa-apple';
            } else if (os_string.indexOf('osx') != -1) {
                return 'fa-apple';
            } else if (os_string.indexOf('android') != -1) {
                return 'fa-android';
            } else {
                return '';
            }
        }
    }

    /** @todo убрать в сервис */
    $scope.getBrowserClass = function(browser_string) {
        if (browser_string) {
            browser_string = browser_string.toLowerCase()
            if (browser_string.indexOf('chrome') != -1) {
                return 'icon-chrome';
            } else if (browser_string.indexOf('firefox') != -1) {
                return 'icon-firefox';
            } else if (browser_string.indexOf('opera') != -1) {
                return 'icon-opera';
            } else if (browser_string.indexOf('internet explorer') != -1) {
                return 'icon-ie';
            } else {
                return '';
            }
        }
    }
}