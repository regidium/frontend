'use strict';

function security($cookieStore) {
    var agent = $cookieStore.get('agent');

    if (agent) {
        agent.first_name= decodeURIComponent(agent.first_name);
        agent.last_name= decodeURIComponent(agent.last_name);
        return agent;
    }

    window.location = '/login';
}

/**
 * @todo Внедрить пагинацию
 * @todo Разделять online & offline
 * @url "/agent/agents"
 */
function AgentAgentsCtrl($scope, $cookieStore, $location, flash, sha1, Agents, Widgets) {
    var agent = security($cookieStore);

    // Блокировка формы редактирования
    $scope.disabled = true;
    // Список агентов
    $scope.agents = [];
    // Выбранный агент
    $scope.current_agent = {};

    // Получаем список агентов
    $scope.agents = Widgets.agents({ uid: agent.widget.uid }, function(data) {
        // Делам текущим первого из списка
        $scope.current_agent = $scope.agents[0];
    });

    // Выбираем агента
    $scope.select = function(agent) {
        $scope.disabled = true;
        $scope.current_agent = agent;
    };

    // Создаем нового агента
    $scope.create = function() {
        $scope.current_agent = {};
        $scope.disabled = false;
    };

    // Редактируем существующего агента
    $scope.edit = function() {
        $scope.disabled = false;
    };

    // Сохраняем агента
    $scope.save = function() {
        // Получаем UID агента
        var agent_uid = $scope.current_agent.uid;
        var password = '';
        if (!$scope.current_agent.uid) {
            // Если агент новый,то UID = new
            agent_uid = 'new';
            password = sha1.encode($scope.current_agent.password);
        }

        var data = {
            first_name: $scope.current_agent.first_name,
            last_name: $scope.current_agent.last_name,
            job_title: $scope.current_agent.job_title,
            avatar: $scope.current_agent.avatar,
            email: $scope.current_agent.email,
            password: password,
            type: $scope.current_agent.type,
            status: $scope.current_agent.status,
            accept_chats: $scope.current_agent.accept_chats
        }

        Widgets.saveAgent({ uid: agent.widget.uid, agent: agent_uid }, data, function(returned) {
            /** @todo Обработка ошибок */
            if (returned && returned.errors) {
                console.log(returned.errors);
                _.each(returned.errors, function(error) {
                    flash.error = error;
                })
            } else {
                // Если создавали пользователя, то добавляем его в список
                if (agent_uid == 'new') {
                    $scope.agents.push(returned);
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