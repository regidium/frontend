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
 * @url "/agent/chats"
 */
function AgentChatsCtrl($rootScope, $scope, $cookieStore, flash, socket, sound, blockUI) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;
    // Определяем блоки блокировки
    var chatsBlockUI = blockUI.instances.get('chatsBlockUI');
    var currentChatBlockUI = blockUI.instances.get('currentChatBlockUI');

    // Резервируем $scope переменную для списка онлайн чатов
    $scope.chats = {};

    // Запрашиваем список чатов онлайн
    socket.emit('chat:online', { widget_uid: widget_uid });
    // Блокируем ожидающие блоки
    chatsBlockUI.start();

    // Получаем список чатов онлайн
    socket.on('chat:online:list', function(data) {
        console.log('Socket chat:online:list', data);

        // Наполняем список чатов онлайн
        angular.forEach(data.chats, function(chat){
            $scope.chats[chat.uid] = chat;
        });

        // Разблокировка ожидающих блоков
        chatsBlockUI.stop(); 
    });

    // Event сервер оповестил о необходимости обновить список пользователей
    socket.on('service:update:users:list', function (data) {
        console.log('Socket service:update:users:list');

        // Если агент не ведет беседу
        if (!$scope.current_chat) {
            // Запрашиваем список чатов онлайн
            socket.emit('chat:online', { widget_uid: widget_uid });
            // Блокируем ожидающие блоки
            chatsBlockUI.start();
        }
    });

    // Чат подключен
    /** @todo Фильтруются ли по статусу? */
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected', data);

        if (data.chat.status == $rootScope.c.CHAT_STATUS_CHATTING) {
            // Добавляем чат в список чатов онлайн
            $scope.chats[data.chat.uid] = data.chat;
        }
    });

    // Чат отключен
    socket.on('chat:disconnected', function (data) {
        console.log('Socket chat:disconnected', data);

/*        if ($scope.current_chat && $scope.current_chat.uid == data.chat_uid) {
            delete $scope.current_chat.uid;
        }*/

        // Удаляем чат из списка чатов онлайн
        delete $scope.chats[data.chat_uid];
    });

    // Пользователь закрыл чат
    /** @todo */
    socket.on('chat:ended', function (data) {
        console.log('Socket chat:ended');
    });

    $scope.selectChat = function(chat) {
        $scope.text = '';
        $scope.current_chat = chat;

        // Подключаем агента к чату
        socket.emit('chat:agent:enter', {
            agent: $scope.agent,
            chat: $scope.current_chat,
            widget_uid: widget_uid
        });

        // Блокируем ожидающие блоки
        currentChatBlockUI.start();
    }

    // Агент подключен к чату
    socket.on('chat:agent:entered', function (data) {
        console.log('Socket chat:agent:entered', data);

        // Отсеиваем чужие оповещения
        if (data.agent.uid == $scope.agent.uid) {
            $scope.current_chat = data.chat;
            if ($scope.current_chat.messages) {
                angular.forEach($scope.current_chat.messages, function(message, key) {
                    if (!message.readed) {
                        socket.emit('chat:message:read:agent', {
                            message_uid: message.uid,
                            chat_uid: $scope.current_chat.uid,
                            widget_uid: widget_uid
                        });
                    }
                });
            }
            // Разблокировка ожидающих блоков
            currentChatBlockUI.stop(); 
        }
    });

    // Пользователь написал сообщение
    socket.on('chat:message:sended:user', function (data) {
        console.log('Socket chat:message:sended:user');

        // Отсеиваем чужие оповещения
        if ($scope.current_chat && data.chat_uid == $scope.current_chat.uid) {
            // Проигрываем звуковое уводомление
            sound.play();

            if(!$scope.current_chat.messages) {
                $scope.current_chat.messages = [];
            }

            // Добавляем сообщение в список сообщений
            $scope.current_chat.messages.push(data.message);

            // Оповещаем слушаталей о прочтении сообщения агентом
            socket.emit('chat:message:read:agent', {
                event_send: true,
                message_uid: data.message.uid,
                chat_uid: data.chat_uid,
                widget_uid: widget_uid
            });
        }
    });

    socket.on('chat:message:readed:user', function (data) {
        console.log('Socket chat:message:readed:user');

        angular.forEach($scope.current_chat.messages, function(message) {
            if (message.uid == data.message_uid) {
                message.readed = true;
            }
        })
    });

    $scope.sendMessage = function () {
        // Блокируем отправку пустых сообщений
        if ($scope.text.length == 0) {
            return false;
        }

        var message = {
            sender_type: $rootScope.c.MESSAGE_SENDER_TYPE_AGENT,
            created_at: (+new Date) / 1000,
            text: $scope.text
        };

        // Оповещаем об отпраке сообщения
        socket.emit('chat:message:send:agent', {
            widget_uid: widget_uid,
            chat_uid: $scope.current_chat.uid,
            message: message
        });

        if (!$scope.current_chat.messages) {
            $scope.current_chat.messages = [];
        }

        // Добавляем сообщение в список сообщений
        $scope.current_chat.messages.push(message);

        // clear message box
        $scope.text = '';
    };
}

/**
 * @url "/agent/chat/:uid"
 * @todo REFACTORING!!!
 */
/*
function AgentChatCtrl($scope, $cookieStore, $routeParams, flash, socket, sound) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;

    //$scope.agent = $scope.agent;
    $scope.text = '';
    $scope.chat = { uid: $routeParams.uid };
    $scope.chat.messages = [];

    // Подключаем агента к чату
    socket.emit('chat:agent:enter', { agent: $scope.agent, chat_uid: $routeParams.uid, widget_uid: widget_uid });
}*/
