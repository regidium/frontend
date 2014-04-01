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
function AgentChatsCtrl($scope, $cookieStore, flash, socket, sound) {
    // Получаем агента из cookie
    $scope.agent = security($cookieStore);
    var widget_uid = $scope.agent.widget.uid;

    // Резервируем $scope переменную для списка онлайн чатов
    $scope.chats = {};

    // Запрашиваем список чатов онлайн
    socket.emit('chat:online', { widget_uid: widget_uid });

    // Получаем список чатов онлайн
    socket.on('chat:online:list', function(data) {
        console.log('Socket chat:online:list', data);

        // Наполняем список чатов онлайн
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

        if ($scope.current_chat && $scope.current_chat.uid == data.chat_uid) {
            delete $scope.current_chat.uid;
        }

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
            chat_uid: $scope.current_chat.chat.uid,
            widget_uid: widget_uid
        });
    }

    // Агент подключен к чату
    socket.on('chat:agent:entered', function (data) {
        console.log('Socket chat:agent:entered');

        // Отсеиваем чужие оповещения
        if (data.agent.uid == $scope.agent.uid) {
            $scope.current_chat = data;

            if(!data.chat.messages) {
                $scope.current_chat.chat.messages = [];
            }
        }
    });

    // Пользователь написал сообщение
    socket.on('chat:message:send:user', function (data) {
        console.log('Socket chat:message:send:user');

        // Отсеиваем чужие оповещения
        if ($scope.current_chat && $scope.current_chat.chat && data.chat_uid == $scope.current_chat.chat.uid) {
            // Проигрываем звуковое уводомление
            sound.play();

            if(!$scope.current_chat.chat.messages) {
                $scope.current_chat.chat.messages = [];
            }

            // Добавляем сообщение в список сообщений
            $scope.current_chat.chat.messages.push({
                created_at: data.created_at,
                agent: data.agent,
                text: data.text
            });
        }
    });

    $scope.sendMessage = function () {
        // Блокируем отправку пустых сообщений
        if ($scope.text.length == 0) {
            return false;
        }

        var created_at = +new Date;

        // Оповещаем об отпраке сообщения
        socket.emit('chat:message:send:agent', {
            widget_uid: widget_uid,
            chat_uid: $scope.current_chat.chat.uid,
            agent: $scope.agent,
            created_at: created_at,
            text: $scope.text
        });

        if (!$scope.current_chat.chat.messages) {
            $scope.current_chat.chat.messages = [];
        }
        // Добавляем сообщение в список сообщений
        $scope.current_chat.chat.messages.push({
            agent: $scope.agent,
            created_at: created_at,
            text: $scope.text
        });

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
