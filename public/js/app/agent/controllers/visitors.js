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
function AgentVisitorsCtrl($scope, $cookieStore, socket, flash, Users, Widgets) {
    // Получаем агента из cookie
    $scope.person = security($cookieStore);
    var widget_uid = $scope.person.agent.widget.uid;

    $scope.chats = {};

    $scope.current_chat = {};

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

        if ($scope.current_chat.chat.uid == data.chat_uid) {
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


    // Агент подключен к чату
    socket.on('chat:agent:entered', function (data) {
        console.log('Socket chat:agent:entered');

        // Отсеиваем чужие оповещения
        if (data.person.uid == $scope.person.uid) {
            $scope.current_chat.chat = data.chat;

            if(!data.chat.messages) {
                $scope.current_chat.chat.messages = [];
            }
        }
    });

    // Пользователь написал сообщение
    socket.on('chat:message:send:user', function (data) {
        console.log('Socket chat:message:send:user');

        // Отсеиваем чужие оповещения
        if (data.chat_uid == $scope.current_chat.chat.uid) {
            // Проигрываем звуковое уводомление
            sound.play();

            // Добавляем сообщение в список сообщений
            $scope.current_chat.chat.messages.push({
                date: data.date,
                person: data.person,
                text: data.text
            });
        }
    });


    $scope.sendMessage = function () {
        // Блокируем отправку пустых сообщений
        if ($scope.text.length == 0) {
            return false;
        }

        // Оповещаем об отпраке сообщения
        socket.emit('chat:message:send:agent', {
            widget_uid: widget_uid,
            chat_uid: $scope.current_chat.chat.uid,
            person: $scope.person,
            date: new Date(),
            text: $scope.text
        });

        // Добавляем сообщение в список сообщений
        $scope.current_chat.chat.messages.push({
            person: $scope.person,
            date: new Date(),
            text: $scope.text
        });

        // clear message box
        $scope.text = '';
    };
}