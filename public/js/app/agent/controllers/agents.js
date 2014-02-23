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
    $scope.current_person = {};

    // Получаем список агентов
    $scope.persons = Widgets.agents({ uid: person.agent.widget.uid }, function(data) {
        // Делам текущим первого из списка
        $scope.current_person = $scope.persons[0];
        console.log($scope.current_person);
    });

    // Выбираем агента
    $scope.select = function(person) {
        $scope.disabled = true;
        $scope.current_person = person;
    };

    // Создаем нового агента
    $scope.create = function() {
        $scope.current_person = {};
        $scope.current_person.agent = {};
        $scope.disabled = false;
    };

    // Редактируем существующего агента
    $scope.edit = function() {
        $scope.disabled = false;
    };

    // Сохраняем агента
    $scope.save = function() {
        // Получаем UID агента
        var person_uid = $scope.current_person.uid;
        var password = '';
        if (!$scope.current_person.uid) {
            // Если агент новый,то UID = new
            person_uid = 'new';
            password = sha1.encode($scope.current_person.password);
        }

        var data = {
            fullname: $scope.current_person.fullname,
            job_title: $scope.current_person.agent.job_title,
            avatar: $scope.current_person.avatar,
            email: $scope.current_person.email,
            password: password,
            type: $scope.current_person.agent.type,
            status: $scope.current_person.agent.status,
            accept_chats: $scope.current_person.agent.accept_chats
        }

        Widgets.saveAgent({ uid: person.agent.widget.uid, agent: person_uid }, data, function(returned) {
            /** @todo Обработка ошибок */
            if (returned && returned.errors) {
                console.log(returned.errors);
                _.each(returned.errors, function(error) {
                    flash.error = error;
                })
            } else {
                // Если создавали пользователя, то добавляем его в список
                if (person_uid == 'new') {
                    $scope.persons.push(returned);
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