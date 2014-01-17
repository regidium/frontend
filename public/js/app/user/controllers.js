'use strict';

function security($cookieStore) {
    var user = $cookieStore.get('user');
    if (user) {
        user.fullname = decodeURIComponent(user.fullname);
        user.model_type = 'user';
        return user;
    }
    //window.location = '/login';
}

/**
 * @url "/logout"
 */
function UserAuthLogoutCtrl($scope, $resource) {
    $scope.logout = function() {
        var Logout = $resource('/logout', {}, {
            query: { method: 'GET', params: {} }
        });

        Logout.query({}, function() {
            window.location = '/';
        });
    }
}

function UserCtrl($scope, $cookieStore) {
    security($cookieStore);
}

function UserChatCtrl($scope, $cookieStore, $location, $routeParams, socket, flash, Chats, ChatsMessages) {
    $scope.user = security($cookieStore);
    $scope.text = '';
    $scope.chat = {};
    $scope.chat.messages = [];

    var sound = document.createElement('audio');
    sound.setAttribute('src', '/sound/chat/chat.mp3');

    if ($routeParams.uid) {
        // Получаем существующий чат
        $scope.chat = Chats.one({uid: $routeParams.uid}, function(data) {
            socket.emit('chat:started', {
                user: $scope.user,
                chat: $scope.chat
            });
        });
    } else {
        // Создаем новый чат
        $scope.chat = Chats.create({}, { user: $scope.user.uid }, function(data) {
            socket.emit('chat:created', {
                user: $scope.user,
                chat: $scope.chat
            });
            $location.path('/user/chat/' + $scope.chat.uid);
        });
    }

    socket.on('chat:agent:message:send', function (data) {
        sound.play();

        $scope.chat.messages.push({
            sender: data.sender,
            text: data.text
        });
    });

    /** Пользователь меняет страницу */
    $scope.$on('$locationChangeStart', function(event) {
        /** Сообщаем агенту о выходе пользователя */
        socket.emit('chat:destroyed', {
            uid: $scope.chat.uid
        });
    });

    $scope.sendMessage = function () {
        if ($scope.text.length == 0) {
            flash.error = 'Empty message!';
            return false;
        };

        var text = $scope.text;
        /** Записываем сообщение в БД */
        ChatsMessages.create({}, { sender: $scope.user.uid, text: text, chat: $scope.chat.uid }, function(data) {
            socket.emit('chat:user:message:send', {
                chat: $scope.chat.uid,
                sender: $scope.user,
                text: text
            });
            // add the message to our model locally
            $scope.chat.messages.push({
                sender: $scope.user,
                text: text
            });
        });

        // clear message box
        $scope.text = '';
    };
}

function UserSettingsCtrl() {

}