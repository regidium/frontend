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
 * @url "/logout"
 */
function AgentAuthLogoutCtrl($scope, $http, $cookieStore, socket) {
    // Получаем пользователя из cookie
    var person = security($cookieStore);

    // Нажатие кнопки Logout
    $scope.logout = function() {
        // Оповещаем об отключении агента
        socket.emit('agent:disconnect', { person_uid: person.uid });

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