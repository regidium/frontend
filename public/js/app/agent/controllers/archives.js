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
 * @url "/agent/archives"
 */
function AgentArchivesCtrl($scope, $cookieStore, socket) {
    // Получаем агента из cookie
    var agent = security($cookieStore);
    var widget_uid = agent.widget.uid;

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