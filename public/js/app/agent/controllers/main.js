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
 * @url "/logout"
 */
function AgentAuthLogoutCtrl($scope, $http, $cookieStore, socket) {
    // Получаем пользователя из cookie
    var agent = security($cookieStore);

    // Нажатие кнопки Logout
    $scope.logout = function() {
        // Оповещаем об отключении агента
        socket.emit('agent:disconnect', { agent_uid: agent.uid });

        // Запрос на отключение агента
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
 * @url "/agent"
 */
function AgentCtrl($scope, $cookieStore) {
    security($cookieStore);
    /** @todo */
};