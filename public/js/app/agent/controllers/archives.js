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
 * @url "/agent/archives"
 */
function AgentArchivesCtrl($scope, $cookieStore, socket) {
    // Получаем агента из cookie
    var person = security($cookieStore);
    var widget_uid = person.agent.widget.uid;

    $scope.chats = {};

    // Запрашиваем список архивных чатов
    socket.emit('chat:archives', { widget_uid: widget_uid });

    // Получаем список архивных чатов
    socket.on('chat:archives:list', function(data) {
        console.log('Socket chat:archives:list', data);

        // Наполняем список архивных чатов
        $scope.chats = data;
    });
}