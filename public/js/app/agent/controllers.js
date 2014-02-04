'use strict';

function security($cookieStore) {
    var person = $cookieStore.get('person');
    if (person) {
        person.fullname = decodeURIComponent(person.fullname);
        return person;
    }

    window.location = '/login';
}

function getSound() {
    var sound = document.createElement('audio');
    var types = {
        '/sound/chat/chat.ogg': 'audio/ogg; codecs="vorbis"',
        '/sound/chat/chat.wav': 'audio/wav; codecs="1"',
        '/sound/chat/chat.mp3': 'audio/mpeg;'
    };

    var audio_file = _.each(types, function(type, file) {
        var e = sound.canPlayType(type);
        if ('probably' === e || 'maybe' === e) {
            return file;
        }
    });

    sound.setAttribute('src', audio_file);

    return sound;
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
    socket.on('user:connected', function (data) {
        console.log('user:connected', data);
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

    // Блокировка формы от редактирования
    $scope.disabled = true;
    // Список агентов
    $scope.agents = [];
    // Выбранный агент
    $scope.agent = {};

    // Получаем список агентов
    if (person.agent.widget) {
        $scope.agents = Widgets.agents({ uid: person.agent.widget.uid }, function(data) {
            // Делам текущим первого из списка
            $scope.agent = $scope.agents[0];
            delete($scope.agent.person.password);
        });
    }

    // Выбираем агента
    $scope.select = function(agent) {
        $scope.disabled = true;
        $scope.agent = agent;
        delete($scope.agent.person.password);
    };

    // Создаем нового агента
    $scope.create = function() {
        $scope.agent = {};
        $scope.agent.person = {};
        $scope.disabled = false;
    };

    // Редактируем существующего агента
    $scope.edit = function() {
        $scope.disabled = false;
    };

    // Сохраняем агента
    $scope.save = function() {
        // Получаем UID агента
        var agent_uid = $scope.agent.uid;
        var password = '';
        if (!$scope.agent.uid) {
            // Если агент новый,то UID = new
            agent_uid = 'new';
            password = sha1.encode($scope.agent.person.password);
        }

        var data = {
            fullname: $scope.agent.person.fullname,
            job_title: $scope.agent.job_title,
            avatar: $scope.agent.person.avatar,
            email: $scope.agent.person.email,
            password: password,
            type: $scope.agent.type,
            status: $scope.agent.status,
            accept_chats: $scope.agent.accept_chats
        }

        Widgets.saveAgent({ uid: person.agent.widget.uid, agent: agent_uid }, data, function(returned) {
            /** @todo Обработка ошибок */
            if (returned && returned.errors) {
                console.log(returned.errors);
            } else {
                // Если создавали пользователя, то добавляем его в список
                if (agent_uid == 'new') {
                    var agent = {};
                    agent = returned.agent;
                    agent.person = returned;
                    delete(agent.person.agent);
                    $scope.agents.push(agent);
                }
                $scope.disabled = true;
            }
        });
/*        if ($scope.agent.uid) {
            Agents.edit({ 'uid': $scope.agent.uid }, $scope.agent, function(data) {
                *//** @todo Обработка ошибок *//*
                if (data && data.errors) {
                    console.log(data.errors);
                } else {
                    $location.path('/agent/agents');
                }
            });
        } else {
            Agents.create({}, $scope.agent, function(data) {
                *//** @todo Обработка ошибок *//*
                if (data && data.errors) {
                    console.log(data.errors);
                } else {
                    $location.path('/agent/agents');
                }
            });
        }*/
    };

    // Отменяем редактирование
    $scope.cancel = function() {
        $scope.disabled = true;
    };

    // Удаляем агента
    $scope.remove = function(agent) {
        if (agent.type != 1) {
            if (confirm('Are you sure you want to remove this agent?')) {
                Agents.remove({ 'uid': agent.uid }, agent.uid, function() {
                    /** @todo Обработка ошибок */
                    flash.success = 'Agent success removed';
                    $scope.agents.splice($scope.agents.indexOf(agent), 1);
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
 * @url "/agent/widget/style"
 */
function AgentSettingsWidgetStyleCtrl($scope, $cookieStore, Widgets) {
    $scope.person = security($cookieStore);
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
function AgentSettingsWidgetPayCtrl($scope, $cookieStore, $location, Widgets, PaymentMethods) {
    var person = security($cookieStore);
    $scope.pay = {};
    $scope.payment_methods = PaymentMethods.all({}, function() {
        $scope.pay.payment_method = $scope.payment_methods[0].uid;
    });

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
function AgentSettingsWidgetPlanCtrl($scope, $cookieStore, $location, Widgets, Plans) {
    var person = security($cookieStore);
    $scope.widget = {};
    $scope.plans = Plans.all({}, function() {
        $scope.widget.plan= $scope.plans[0].uid;
    });

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

    // Получаем список чатов онлайн
    socket.emit('chats:online', widget_uid, function(chats) {
        console.log(chats);
        // Наполняем список чатов онлайн
        $scope.chats = chats;
    });

    // Пользователь создал чат
    socket.on('chat:created', function (data) {
        console.log('chat:created', data);
        // Отделяем ненужные оповещения
        if (data.widget == widget_uid) {
            // Добавляем чат в список чатов онлайн
            $scope.chats[data.chat.uid] = data;
        }
    });

    // Пользователь открыл чат
    socket.on('chat:started', function (data) {
        console.log('chat:started', data);
        // Отделяем ненужные оповещения
        if (data.widget == widget_uid) {
            // Добавляем чат в список чатов онлайн
            $scope.chats[data.chat.uid] = data;
        }
    });

    // Пользователь покинул чат
    socket.on('chat:destroyed', function (data) {
        console.log('chat:destroyed', data);
        // Отделяем ненужные оповещения
        if (data.widget == widget_uid) {
            // Удаляем чат из списка чатов онлайн
            delete $scope.chats[data.chat];
        }
    });

    // Пользователь закрыл чат
    /** @todo */
    socket.on('chat:ended', function (data) {
        console.log('chat:ended', data);
        // Удаляем чат из списка чатов онлайн
        delete $scope.chats[data.chat.uid];
    });
}

/**
 * @url "/agent/chat/:uid"
 * @todo REFACTORING!!!
 */
function AgentChatCtrl($scope, $cookieStore, $routeParams, flash, socket, Agents, Chats, ChatsMessages) {
    // Получаем агента из cookie
    $scope.person = security($cookieStore);
    var widget_uid = $scope.person.agent.widget.uid;

    //$scope.agent = $scope.person.agent;
    $scope.text = '';
    $scope.chat = {};
    $scope.chat.messages = [];

    // Подключаем аудио файл для звукового оповещания
    var sound = getSound();

    // Получаем существующий чат
    $scope.chat = Chats.one({uid: $routeParams.uid}, function(data) {
        // Подключаем агента к чату
        Agents.connectToChat({uid: $scope.person.agent.uid, chat: $routeParams.uid})
        socket.emit('chat:agent:enter', { chat: $routeParams.uid, agent: $scope.person });
        console.log($scope.chat);
    });

    /** агент меняет страницу */
    $scope.$on('$locationChangeStart', function(event) {
        console.log('$locationChangeStart', $scope.visitor);
        socket.emit('agent:chat:exited', {
            chat: $scope.chat.uid,
            agent: $scope.person.agent.uid
        });
    });

    // Пользователь написал сообщение
    socket.on('chat:user:message:send', function (data) {
        // Отсеиваем чужие оповещения
        if (data.chat == $scope.chat.uid) {
            // Проигрываем звуковое уводомление
            sound.play();

            // Добавляем сообщение в список сообщений
            $scope.chat.messages.push({
                date: data.date,
                sender: data.sender,
                text: data.text
            });
        }
    });

    $scope.sendMessage = function () {
        if ($scope.text.length == 0) {
            flash.error = 'Empty message!';
            return false;
        };

        var text = $scope.text;
        var message_data = {
            date: new Date(),
            sender: $scope.person.agent,
            text: text
        };

        var message_data_emit = message_data;
        message_data_emit.widget = widget_uid;
        message_data_emit.chat = $scope.chat.uid;

        // Сохраняем сообщение в БД
        ChatsMessages.create({}, { sender: $scope.person.agent.uid, text: text, chat: $scope.chat.uid }, function(data) {
            // Оповещаем об отпраке сообщения
            socket.emit('chat:agent:message:send', message_data_emit);

            $scope.chat.messages.push(message_data);
        });

        // clear message box
        $scope.text = '';
    };
}