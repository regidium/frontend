'use strict';

/**
 * @todo Внедрить пагинацию
 * @todo Разделять online & offline
 * @url "/agent/agents"
 */
function AgentAgentsCtrl($rootScope, $scope, $http, $log, $fileUploader, flash, sha1, socket, blockUI) {
    // Определяем блоки блокировки
    var agentBlockUI = blockUI.instances.get('agentBlockUI');
    var menuBlockUI = blockUI.instances.get('menuBlockUI');

    // Блокировка формы редактирования
    $scope.disabled = true;
    // Список агентов
    $scope.agents = [];
    // Выбранный агент
    $scope.current_agent = {};

    // Запрашиваем список агентов
    socket.emit('agent:existed', { widget_uid: $rootScope.widget.uid });
    // Блокируем ожидающие блоки
    agentBlockUI.start();
    menuBlockUI.start();

    // Получаем список агентов
    socket.on('agent:existed:list', function(data) {
        $log.debug('Socket agent:existed:list');

        // Наполняем список чатов онлайн
        $scope.agents = data.agents;

        // Делам текущим первого из списка
        $scope.current_agent = $scope.agents[0];

        // Разблокировка ожидающих блоков
        agentBlockUI.stop(); 
        menuBlockUI.stop(); 
    });

    // Получено событие сохранения агента
    socket.on('agent:saved', function(data) {
        $log.debug('Socket agent:saved');

        var existed = false;

        angular.forEach($scope.agents, function(agent, key) {
            if (agent.uid == data.agent.uid) {
                agent = data.agent;
                existed = true;
            }
        });

        if (existed == false) {
            $scope.agents.push(data.agent);
        }

        flash.success = 'Agent saved';
    });

    // Получено событие удаления агента
    socket.on('agent:removed', function(data) {
        $log.debug('Socket agent:removed');

        var existed = {};

        angular.forEach($scope.agents, function(agent, key) {
            if (agent.uid == data.agent_uid) {
                existed = agent;
            }
        });

        if (existed) {
            $scope.agents.splice($scope.agents.indexOf(existed), 1);
        }

        flash.success = 'Agent removed';
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

        // Определяем загрузчик файлов
        var uploader = $scope.uploader = $fileUploader.create({
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            scope: $scope,
            url: $rootScope.config.fsUrl + 'upload/' + $rootScope.widget.uid + '/agent/avatar/' + $scope.current_agent.uid,
            filters: [
                function(item) {
                    var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
                    type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            ]
        });

        // Добавляем обрабочик загрузки файла
        uploader.bind('success', function (event, xhr, item, response) {
            if (response && response.url) {
                $('#avatar').attr('url', '');
                $('#avatar').attr('url', response.url);
                $scope.current_agent.avatar = response.url;
                flash.success = 'Agent avatar uploaded';
            }
        });
    };

    $scope.removeAvatar = function() {
        $http.delete($rootScope.config.fsUrl + $rootScope.widget.uid + '/avatars/' + $scope.current_agent.uid)
            .success(function(data, status, headers, config) {
                if (data && data.success) {
                    $scope.current_agent.avatar = '';
                    flash.success = 'Agent avatar removed';
                } else if (data && data.errors) {
                    $log.debug(data.errors);
                    flash.error = data.errors;
                } else {
                    $log.debug(data);
                    flash.error = 'System error!';
                }
            }).error(function(data, status, headers, config) {
                if (data && data.errors) {
                    $log.debug(data.errors);
                    flash.error = data.errors;
                } else {
                    $log.debug('System error!');
                    flash.error = 'System error!';
                }
        });
    }

    // Сохраняем агента
    $scope.save = function() {
        // Получаем UID агента
        var uid = $scope.current_agent.uid;
        var password = '';
        if (!$scope.current_agent.uid) {
            // Если агент новый,то UID = new
            uid = 'new';
            password = sha1.encode($scope.current_agent.password);
        }

        var agent_data = {
            first_name: $scope.current_agent.first_name,
            last_name: $scope.current_agent.last_name,
            job_title: $scope.current_agent.job_title,
            avatar: $scope.current_agent.avatar,
            email: $scope.current_agent.email,
            password: password,
            type: $scope.current_agent.type,
            accept_chats: $scope.current_agent.accept_chats,
            render_visitors_period: $scope.current_agent.render_visitors_period,
            uid: uid,
            widget_uid: $rootScope.widget.uid
        };

        // Отправляем событие сохранения агента
        socket.emit('agent:save', { agent: agent_data, widget_uid: $rootScope.widget.uid });

        // Блокируем редактирование формы
        $scope.disabled = true;
    };

    // Отменяем редактирование
    $scope.cancel = function() {
        $scope.disabled = true;
    };

    // Удаляем агента
    $scope.remove = function() {
        if ($scope.current_agent.type != 1) {
            if (confirm('Are you sure you want to remove this agent?')) {

                // Отправляем событие сохранения агента
                socket.emit('agent:remove', { agent_uid: $scope.current_agent.uid, widget_uid: $rootScope.widget.uid });

                $scope.current_agent = $scope.agents[0];
                $scope.disabled = true;

                flash.success = 'Agent removed';
            }
        } else {
            flash.success = 'Владелец виджета не может быть удален!';
        }
    };
}