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
function UserAuthLogoutCtrl($scope, $http) {
    $scope.logout = function() {
        $http.get('/logout')
            .success(function(data, status, headers, config) {
                window.location = '/';
            })
            .error(function(data, status, headers, config) {
                window.location = '/';
            });
    }
}

/**
 * @url "/user"
 */
function UserCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/user/chats"
 */
function UserChatsCtrl($scope, $cookieStore, flash, socket, Users) {
    var user = security($cookieStore);
    $scope.chats = Users.allChats({uid: user.uid});
}

/**
 * @url "/user/chat"
 * @url "/user/chat/:uid"
 */
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
            if ($scope.chat && $scope.chat.uid) {
                socket.emit('chat:created', {
                    user: $scope.user,
                    chat: $scope.chat
                });
                $location.path('/user/chat/' + $scope.chat.uid);
            } else {
                if (data.errors) {
                    $scope.map(data.errors, function(error) {
                        flash.error = error;
                    });
                }
                history.back();
            }
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

/**
 * @url "/user/settings"
 */
function UserSettingsCtrl() {

}