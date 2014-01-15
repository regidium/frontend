'use strict';

function security($cookieStore) {
    var agent = $cookieStore.get('agent');
    if (agent) {
        return agent;
    }
    window.location = '/login';
}

/**
 * @url "/logout"
 */
function AgentAuthLogoutCtrl($scope, $http, socket) {
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
 * @url "/agent"
 */
function AgentCtrl($scope, $cookieStore) {
    security($cookieStore);
    /** @todo */
};

/**
 * @url "/agent/users"
 */
function AgentUsersCtrl($scope, $cookieStore) {
    security($cookieStore);
    /** @todo */
}

/**
 * @url "/agent/users/list"
 */
function AgentUsersListCtrl($scope, $cookieStore, flash, Users) {
    security($cookieStore);
    /** @todo Внедрить пагинацию */
    $scope.users = Users.all();

    $scope.remove = function(user) {
        if (confirm('Are you sure you want to remove this user?')) {
            Users.remove({ 'uid': user.uid }, user.uid, function(data) {
                flash.success = 'User success removed';
                $scope.users.splice($scope.users.indexOf(user), 1);
            });
        }
    };
}

/**
 * @url "/agent/users/detail/:uid"
 */
function AgentUsersDetailCtrl($scope, $cookieStore, $routeParams, $location, Users) {
    security($cookieStore);
    $scope.disabled = true;

    $scope.user = Users.one({ uid: $routeParams.uid });

    $scope.edit = function() {
        $location.path('/agent/users/edit/' + $routeParams.uid);
    };
}

/**
 * @url "/agent/users/edit/:uid"
 */
function AgentUsersEditCtrl($scope, $cookieStore, $routeParams, $location, Users) {
    security($cookieStore);
    $scope.disabled = false;
    $scope.user = Users.one({ uid: $routeParams.uid });

    $scope.cancel = function() {
        $location.path('/agent/users/list');
    };

    $scope.remove = function() {
        if (confirm('Are you sure you want to remove this user?')) {
            Users.remove({ 'uid': $scope.user.uid }, $scope.user.uid, function() {
                /** @todo Обработка ошибок */
                $location.path('/agent/users/list');
            });
        }
    };

    $scope.save = function() {
        Users.edit({ 'uid': $scope.user.uid }, $scope.user, function() {
            /** @todo Обработка ошибок */
            $location.path('/agent/users/list');
        });
    };
}

/**
 * @url "/agent/agents"
 */
function AgentAgentsCtrl($scope, $cookieStore) {
    security($cookieStore);
    /** @todo */
}

/**
 * @url "/agent/agents/list"
 */
function AgentAgentsListCtrl($scope, $cookieStore, flash, Agents) {
    security($cookieStore);
    /** @todo Внедрить пагинацию */
    $scope.agents = Agents.all();

    $scope.remove = function(agent) {
        if (confirm('Are you sure you want to remove this agent?')) {
            Agents.remove({ 'uid': agent.uid }, agent.uid, function() {
                /** @todo Обработка ошибок */
                flash.success = 'Agent success removed';
                $scope.agents.splice($scope.agents.indexOf(agent), 1);
            });
        }
    };
}

/**
 * @url "/agent/agents/detail/:uid"
 */
function AgentAgentsDetailCtrl($scope, $cookieStore, $routeParams, $location, Agents) {
    security($cookieStore);
    $scope.disabled = true;

    $scope.agent = Agents.one({ uid: $routeParams.uid });

    $scope.edit = function() {
        $location.path('/agent/agents/edit/' + $routeParams.uid);
    };
}

/**
 * @url "/agent/agents/create"
 */
function AgentAgentsCreateCtrl($scope, $cookieStore, $location, sha1, Agents) {
    security($cookieStore);
    $scope.disabled = false;
    $scope.agent = {
        fullname: '',
        avatar: '',
        email: '',
        password: '',
        type: 1,
        status: 1,
        accept_chats: true
    };

    $scope.cancel = function() {
        $location.path('/agent/agents/list');
    };

    $scope.save = function() {
        var data = {
            fullname: $scope.agent.fullname,
            avatar: $scope.agent.avatar,
            email: $scope.agent.email,
            password: sha1.encode($scope.agent.password),
            type: $scope.agent.type,
            status: $scope.agent.status,
            accept_chats: $scope.agent.accept_chats
        }
        Agents.create({}, data, function() {
            /** @todo Обработка ошибок */
            /** @todo Переходить на страницу агента */
            $location.path('/agent/agents/list');
        });
    };
}

/**
 * @url "/agent/agents/edit/:uid"
 */
function AgentAgentsEditCtrl($scope, $cookieStore, $routeParams, $location, Agents) {
    security($cookieStore);
    $scope.disabled = false;
    $scope.agent = Agents.one({ uid: $routeParams.uid }, function() {
        /** @todo Делать это на сервере */
        delete($scope.agent.password);
    });

    $scope.cancel = function() {
        $location.path('/agent/agents/list');
    };

    $scope.remove = function() {
        if (confirm('Are you sure you want to remove this agent?')) {
            Agents.remove({ 'uid': $scope.agent.uid }, $scope.agent.uid, function(data) {
                /** @todo Обработка ошибок */
                $location.path('/agent/agents/list');
            });
        }
    };

    $scope.save = function() {
        Agents.edit({ 'uid': $scope.agent.uid }, $scope.agent, function(data) {
            /** @todo Обработка ошибок */
            if (data && data.errors) {
                console.log(data.errors);
            } else {
                $location.path('/agent/agents/list');
            }
        });
    };
}

/**
 * @url "/agent/settings"
 */
function AgentSettingsCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/settings/widget"
 */
function AgentSettingsWidgetCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/settings/productivity"
 */
function AgentSettingsProductivityCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/statistics"
 */
function AgentStatisticsCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/chats"
 */
function AgentChatsCtrl($scope, $cookieStore, flash, socket) {
    security($cookieStore);
    $scope.rooms = [];
    socket.emit('agent:list:chats', '', function(rooms) {
        //delete rooms[''];
        console.log(rooms);
        $scope.rooms = Object.keys(rooms).map(function(room, index) { return  room = room.replace('/',''); });
        console.log($scope.rooms);
    });
}

/**
 * @url "/agent/chat/:uid"
 */
function AgentChatCtrl($scope, $cookieStore, $routeParams, flash, socket) {
    $scope.agent = security($cookieStore);
    $scope.agent.fullname = decodeURIComponent($scope.agent.fullname);
    $scope.text = '';

    // Подключаем агента к чату
    /** @todo Делать PUT запрос в API, для подключения агента в чат */
    socket.emit('agent:enter:chat', $routeParams.uid);

    // Пользователь написал сообщение
    socket.on('user:send:message', function (data) {
        $scope.messages.push({
            user: data.user,
            text: data.text
        });
    });

    $scope.messages = [];

    $scope.sendMessage = function () {
        if ($scope.text.length == 0) {
            flash.error = 'Empty message!';
            return false;
        };

        // Отправляем сообщение пользователю
        socket.emit('agent:send:message', {
            chat: $routeParams.uid,
            agent: $scope.agent,
            text: $scope.text
        });

        // add the message to our model locally
        $scope.messages.push({
            agent: $scope.agent,
            text: $scope.text
        });

        // clear message box
        $scope.text = '';
    };
}