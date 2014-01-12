'use strict';

function security($cookieStore) {
    var user = $cookieStore.get('user');
    if (user) {
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

/* todo Поделить на разделы (то что есть, вынести в раздел "Chat") **/
function UserChatCtrl($scope, $cookieStore, socket, flash) {
    $scope.message = '';
    $scope.user = security($cookieStore);
    $scope.user.fullname = decodeURIComponent($scope.user.fullname);

    socket.on('send:message', function (message) {
        $scope.messages.push({
            owner: message.owner,
            text: message.text
        });
    });

    $scope.messages = [];

    $scope.sendMessage = function () {
        if ($scope.message.length == 0) {
            flash.error = 'Empty message!';
            return false;
        };

        socket.emit('send:message', {
            owner: $scope.user,
            message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
            owner: $scope.user,
            text: $scope.message
        });

        // clear message box
        $scope.message = '';
    };
}

function UserSettingsCtrl() {

}