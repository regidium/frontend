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

/**
 * @todo Внедрить пагинацию
 * @url "/agent/visitors"
 */
function AgentVisitorsCtrl($scope, $cookieStore, socket, flash, Users, Widgets) {
    var person = security($cookieStore);
    var widget_uid =  person.agent.widget.uid;

    $scope.users = [];

    // Получаем список пользователей по виджету
    if (person.agent.widget) {
        $scope.users = Widgets.users({ uid: person.agent.widget.uid });
    }

    // Удаляем пользователя
    $scope.remove = function(user) {
        if (confirm('Are you sure you want to remove this user?')) {
            Users.remove({ 'uid': user.uid }, user.uid, function(data) {
                flash.success = 'User success removed';
                $scope.users.splice($scope.users.indexOf(user), 1);
            });
        }
    };

    // Получаем список пользователей онлайн
    socket.emit('users:online', widget_uid, function(users) {
        console.log('users:online', users);
        // Наполняем список пользователей онлайн
        console.log(users);
        $scope.users = users;
    });

    // Пользователь оналайн
    socket.on('chat:created', function (data) {
        console.log('chat:created', data);
        // Добавляем пользователя в список пользователей онлайн
        $scope.users[data.person.uid] = data.person;
    });

    // Пользователь обновил страницу
    socket.on('user:refreshed', function (user) {
        console.log('user:online', user);
        // Удаляем пользователя из списка пользователей онлайн
        delete $scope.users[user.uid];
    });

    // Пользователь покинул сайт
    socket.on('user:exited', function (user) {
        console.log('user:exited', user);
        // Удаляем пользователя из списка пользователей онлайн
        delete $scope.users[user.uid];
    });
}

/**
 * @todo Внедрить пагинацию
 * @todo Разделять online & offline
 * @url "/agent/agents"
 */
function AgentAgentsCtrl($scope, $cookieStore, $location, flash, sha1, Agents, Widgets) {
    var person = security($cookieStore);

    // Блокировка формы редактирования
    $scope.disabled = true;
    // Список агентов
    $scope.persons = [];
    // Выбранный агент
    $scope.person = {};

    // Получаем список агентов
    $scope.persons = Widgets.agents({ uid: person.agent.widget.uid }, function(data) {
        // Делам текущим первого из списка
        $scope.person = $scope.persons[0];
    });

    // Выбираем агента
    $scope.select = function(person) {
        $scope.disabled = true;
        $scope.person = person;
    };

    // Создаем нового агента
    $scope.create = function() {
        $scope.person = {};
        $scope.person.agent = {};
        $scope.disabled = false;
    };

    // Редактируем существующего агента
    $scope.edit = function() {
        $scope.disabled = false;
    };

    // Сохраняем агента
    $scope.save = function() {
        // Получаем UID агента
        var person_uid = $scope.person.uid;
        var password = '';
        if (!$scope.person.uid) {
            // Если агент новый,то UID = new
            person_uid = 'new';
            password = sha1.encode($scope.person.password);
        }

        var data = {
            fullname: $scope.person.fullname,
            job_title: $scope.person.agent.job_title,
            avatar: $scope.person.avatar,
            email: $scope.person.email,
            password: password,
            type: $scope.person.agent.type,
            status: $scope.person.agent.status,
            accept_chats: $scope.person.agent.accept_chats
        }

        Widgets.saveAgent({ uid: person.agent.widget.uid, agent: person_uid }, data, function(returned) {
            /** @todo Обработка ошибок */
            if (returned && returned.errors) {
                console.log(returned.errors);
            } else {
                // Если создавали пользователя, то добавляем его в список
                if (person_uid == 'new') {
                    var person = {};
                    person = returned.person;
                    person.person = returned;
                    $scope.persons.push(person);
                }

                $scope.disabled = true;
            }
        });
    };

    // Отменяем редактирование
    $scope.cancel = function() {
        $scope.disabled = true;
    };

    // Удаляем агента
    $scope.remove = function(person) {
        if (person.type != 1) {
            if (confirm('Are you sure you want to remove this agent?')) {
                Agents.remove({ 'uid': person.uid }, person.uid, function() {
                    /** @todo Обработка ошибок */
                    flash.success = 'Agent success removed';
                    $scope.persons.splice($scope.persons.indexOf(person), 1);
                });
            }
        } else {
            flash.success = 'Владелец чата не может быть удален!';
        }
    };
}

/**
 * @url "/agent/settings"
 */
function AgentSettingsCtrl($scope, $cookieStore, Widgets) {
    security($cookieStore);
}

/**
 * @url "/agent/settings/widget"
 */
function AgentSettingsWidgetCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/widget/style"
 */
function AgentSettingsWidgetStyleCtrl($scope, $cookieStore, Widgets) {
    $scope.person = security($cookieStore);
    $scope.settings = {};

    Widgets.one({ uid: $scope.person.agent.widget.uid }, function(data) {
        $scope.settings = data.settings;
    });

    $scope.submit = function() {
        Widgets.saveSettings({ uid: $scope.person.agent.widget.uid }, $scope.settings);
    }
//    $scope.widget = Widgets.one({ uid: person.widget.uid });

/*    $scope.save = function() {
        Widgets.edit({ 'uid': $scope.widget.uid }, $scope.widget, function(data) {
            *//** @todo Обработка ошибок *//*
            if (data && data.errors) {
                console.log(data.errors);
            } else {
                $location.path('/agent/widgets');
            }
        });
    };*/
}

/**
 * @url "/agent/widget/pay"
 */
function AgentSettingsWidgetPayCtrl($scope, $cookieStore, $location, Widgets) {
    var person = security($cookieStore);
    $scope.pay = {};

    $scope.submit = function() {
        alert('В этом месте будет редирект на систему online оплаты. При положительном ответе, оплаченная сумма будет внесена на счет клиента');
        Widgets.pay({}, { uid: person.widget.uid, payment_method: $scope.pay.payment_method, amount: $scope.pay.amount }, function(data) {
            // @todo Делать запрос в платежную систему, по возврату зачислять оплату и выводить страницу выбора плана
            $location.path('/agent/settings/widget');
        });
    }
}

/**
 * @url "/agent/widget/plan"
 */
function AgentSettingsWidgetPlanCtrl($scope, $cookieStore, $location, Widgets) {
    var person = security($cookieStore);
    $scope.widget = {};

    $scope.submit = function() {
        Widgets.plan({}, { uid: person.widget.uid, plan: $scope.widget.plan }, function(data) {
            $location.path('/agent/settings/widget');
        });
    }
}

/**
 * @todo
 * @url "/agent/settings/productivity"
 */
function AgentSettingsProductivityCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @todo
 * @url "/agent/statistics"
 */
function AgentStatisticsCtrl($scope, $cookieStore) {
    security($cookieStore);
}

/**
 * @url "/agent/chats"
 */
function AgentChatsCtrl($scope, $cookieStore, flash, socket) {
    // Получаем агента из cookie
    $scope.person = security($cookieStore);
    var widget_uid = $scope.person.agent.widget.uid;

    $scope.chats = {};

    // Запрашиваем список чатов онлайн
    socket.emit('chat:online', { widget_uid: widget_uid });

    // Получаем список чатов онлайн
    socket.on('chat:online:list', function(data) {
        console.log('Socket chat:online:list', data);

        // Наполняем список чатов онлайн
        $scope.chats = data;
    });

    // Чат подключен
    socket.on('chat:connected', function (data) {
        console.log('Socket chat:connected', data);

        // Добавляем чат в список чатов онлайн
        $scope.chats[data.chat.uid] = data;
    });

    // Чат отключен
    socket.on('chat:disconnected', function (data) {
        console.log('Socket chat:disconnected', data);

        // Удаляем чат из списка чатов онлайн
        delete $scope.chats[data.chat_uid];
    });

    // Пользователь закрыл чат
    /** @todo */
    socket.on('chat:ended', function (data) {
        console.log('Socket chat:ended');
    });
}

/**
 * @url "/agent/chat/:uid"
 * @todo REFACTORING!!!
 */
function AgentChatCtrl($scope, $cookieStore, $routeParams, flash, socket, sound) {
    // Получаем агента из cookie
    $scope.person = security($cookieStore);
    var widget_uid = $scope.person.agent.widget.uid;

    //$scope.agent = $scope.person.agent;
    $scope.text = '';
    $scope.chat = { uid: $routeParams.uid };
    $scope.chat.messages = [];

    // Подключаем агента к чату
    socket.emit('chat:agent:enter', { person: $scope.person, chat_uid: $routeParams.uid, widget_uid: widget_uid });

    // Агент подключен к чату
    socket.on('chat:agent:entered', function (data) {
        console.log('Socket chat:agent:entered');

        // Отсеиваем чужие оповещения
        if (data.person.uid == $scope.person.uid) {
            $scope.chat = data.chat;

            if(!data.chat.messages) {
                $scope.chat.messages = [];
            }
        }
    });

    // Пользователь написал сообщение
    socket.on('chat:message:send:user', function (data) {
        console.log('Socket chat:message:send:user');

        // Отсеиваем чужие оповещения
        if (data.chat_uid == $scope.chat.uid) {
            // Проигрываем звуковое уводомление
            sound.play();

            // Добавляем сообщение в список сообщений
            $scope.chat.messages.push({
                date: data.date,
                person: data.person,
                text: data.text
            });
        }
    });

    $scope.sendMessage = function () {
        // Блокируем отправку пустых сообщений
        if ($scope.text.length == 0) {
            return false;
        };

        // Оповещаем об отпраке сообщения
        socket.emit('chat:message:send:agent', {
            widget_uid: widget_uid,
            chat_uid: $scope.chat.uid,
            person: $scope.person,
            date: new Date(),
            text: $scope.text
        });

        // Добавляем сообщение в список сообщений
        $scope.chat.messages.push({
            person: $scope.person,
            date: new Date(),
            text: $scope.text
        });

        // clear message box
        $scope.text = '';
    };
}