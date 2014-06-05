'use strict';

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($rootScope, $scope, $location, $log, $translate, socket, flash, blockUI) {
    // Определяем блоки блокировки
    var visitorsBlockUI = blockUI.instances.get('visitorsBlockUI');

    $scope.chats = {};

    $scope.current_chat = {};

    var visitorsPageState = localStorage.getItem('visitorsPageState');
    switch (visitorsPageState) {
        case '1':
            $scope.is_open_online = true;
            break;
        case '2':
            $scope.is_open_chatting = true;
            break;
        case '3':
            $scope.is_open_offline = true;
            break;
    }

    $scope.accordionSwith = function(list, state) {
        if (!state) {
            localStorage.setItem('visitorsPageState', list);
        }
    };

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

    // Изменен Referrer чата
    socket.on('chat:referrer:changed', function (data) {
        $log.debug('Socket chat:referrer:changed', data);

        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].referrer = data.referrer;
            $scope.chats[data.chat_uid].keywords = data.keywords;
        }

        if ($scope.current_chat && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat.referrer = data.referrer;
            $scope.current_chat.keywords = data.keywords;
        }
    });

    // Получаем список чатов
    socket.on('chat:existed:list', function(data) {
        $log.debug('Socket chat:existed:list');

        // Наполняем список чатов
        angular.forEach(data, function(chat) {
            if (chat.current_url) {
                try {
                    chat.current_url = decodeURIComponent(chat.current_url);
                    if (chat.referrer) {
                        chat.referrer = decodeURIComponent(chat.referrer);
                    }
                } catch(e) {
                    $log.debug(chat);
                }
            }

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

    // Изменился статус чата
    socket.on('chat:status:changed', function (data) {
        $log.debug('Socket chat:status:changed');

        if (data.chat.status == $rootScope.c.CHAT_STATUS_CHATTING) {
            // Добавляем чат в список чатов онлайн
            $scope.chats[data.chat.uid] = data.chat;
        }
    });

    // Чат создан
    socket.on('chat:created', function (data) {
        $log.debug('Socket chat:created', data);

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data.chat;
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        $log.debug('Socket chat:connected', data);

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data.chat;
    });

    // Чат отключен
    socket.on('chat:disconnect', function (data) {
        $log.debug('Socket chat:disconnect', data);

        if ($scope.current_chat && $scope.current_chat.uid && $scope.current_chat.uid == data.chat_uid) {
            $scope.current_chat = {};
        }

        // Переносим чат из списка чатов онлайн в список покинувших сайт
        if ($scope.chats[data.chat_uid]) {
            $scope.chats[data.chat_uid].status = $rootScope.c.CHAT_STATUS_OFFLINE;
            $scope.chats[data.chat_uid].ended_at = Math.round(+new Date()/1000);
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
                try {
                    $scope.current_chat.current_url = decodeURIComponent($scope.current_chat.current_url);
                    if ($scope.current_chat.referrer) {
                        $scope.current_chat.referrer = decodeURIComponent($scope.current_chat.referrer);
                    }
                } catch(e) {
                    $log.debug($scope.current_chat);
                }
        }
    };

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
    };

    $scope.getReferrer = function(chat) {
        var referrer = chat.referrer;
        if (referrer.indexOf('google.') != -1) {
            return 'Google';
        } else if (referrer.indexOf('yandex.') != -1) {
            return 'Яндекс';
        } else if (referrer.indexOf('bing.') != -1) {
            return 'Bing';
        } else if (referrer.indexOf('mail.ru') != -1) {
            return 'Mail.ru';
        } else if (referrer.indexOf('rambler.') != -1) {
            return 'Rambler';
        } else {
            return referrer;
        }
    };
}