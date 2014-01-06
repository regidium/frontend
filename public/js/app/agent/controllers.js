'use strict';

function AgentCtrl($scope, $cookieStore, socket) {

}

/** Вынести $resourse в сервисы */
function AgentUserListCtrl($scope, $resource) {
    /** Вынести $resourse в сервисы */
    var Users = $resource('/agent/users', {}, {
        get: { method: 'GET', params: {}, isArray: true }
    });

    /** @todo Внедрить пагинацию */
    $scope.users = Users.get({});
}

function AgentChatCtrl($scope, $cookieStore, socket) {
    $scope.agent = $cookieStore.get('agent');
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
            owner: $scope.agent,
            message: $scope.message
        });

        // add the message to our model locally
        $scope.messages.push({
            owner: $scope.agent,
            text: $scope.message
        });

        // clear message box
        $scope.message = '';
    };
}