'use strict';

/* todo Поделить на разделы (то что есть, вынести в раздел "Chat") **/
function UserCtrl($scope, $cookieStore, socket) {
    $scope.user = $cookieStore.get('user');
    $scope.user.fullname = decodeURIComponent($scope.user.fullname);

    socket.on('send:message', function (message) {
        $scope.messages.push({
            owner: message.owner,
            text: message.text
        });
    });

    $scope.messages = [];

    $scope.sendMessage = function () {
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
};