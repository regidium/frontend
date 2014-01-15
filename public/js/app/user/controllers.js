'use strict';

function security($cookieStore) {
    var user = $cookieStore.get('user');
    if (user) {
        user.fullname = decodeURIComponent(user.fullname);
        return user;
    }
    window.location = '/login';
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

function UserChatCtrl($scope, $cookieStore, socket, flash, Chats) {
    $scope.text = '';
    $scope.user = security($cookieStore);

    var sound = document.createElement('audio');
    sound.setAttribute('src', '/sound/chat/chat.mp3');

    // Создаем новый чат
    /** @todo Поправить API (не обрабатывается POST) */
    $scope.chat = Chats.create({}, { user: $scope.user.uid }, function(data) {
        console.log(data);
        socket.emit('user:create:chat', {
            user: $scope.user,
            chat: $scope.chat
        });
    });

    socket.on('agent:send:message', function (data) {
        // Если текущий пользователь и не отправитель, и не получатель, то ему сообщение не пказываем
/*        if (message.sender != $scope.user.uid && message.receiver != $scope.user.uid) {
            console.log('Ему не должно показываться это сообщение');
            return;
        }*/
        sound.play();

        $scope.messages.push({
            agent: data.agent,
            text: data.text
        });
    });

    $scope.messages = [];

    $scope.sendMessage = function () {
        if ($scope.text.length == 0) {
            flash.error = 'Empty message!';
            return false;
        };

        socket.emit('user:send:message', {
            chat: $scope.chat.uid,
            user: $scope.user,
            text: $scope.text
        });

        // add the message to our model locally
        $scope.messages.push({
            user: $scope.user,
            text: $scope.text
        });

        // clear message box
        $scope.text = '';
    };
}

function UserSettingsCtrl() {

}