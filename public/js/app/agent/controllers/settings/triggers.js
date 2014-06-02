'use strict';

/**
 * @url "/agent/settings/triggers"
 */
function AgentSettingsTriggersCtrl($rootScope, $scope, $translate, socket, blockUI, flash) {
    // Определяем блоки блокировки
    var triggerBlockUI = blockUI.instances.get('triggerBlockUI');
    var menuBlockUI = blockUI.instances.get('menuBlockUI');

    // Делаем запрос информации о виджете
    socket.emit('widget:info:get', { widget_uid: $rootScope.widget.uid });

    // Блокируем ожидающие блоки
    triggerBlockUI.start();
    menuBlockUI.start();

    // Event сервер прислала информацию о виджете
    socket.on('widget:info:sended', function(data) {
        $scope.triggers = data.triggers;

        // Разблокировка ожидающих блоков
        triggerBlockUI.stop(); 
        menuBlockUI.stop(); 
    });

    // Настройки триггеров виджета изменены
    socket.on('widget:setting:triggers:edited', function(data) {
        var exists = false;
        var triggers = [];

        angular.forEach($scope.triggers, function(trigger) {
            if (trigger.uid == data.trigger.uid) {
                trigger = data.trigger;
                this.push(trigger);
                exists = true;
            }
        }, triggers);
        $scope.triggers = triggers;

        if (exists == false) {
            $scope.triggers.push(data.trigger);
        }

        flash.success = $translate('Trigger saved');
    });

    // Триггер удален
    socket.on('widget:setting:triggers:removed', function(data) {
        angular.forEach($scope.triggers, function(trigger) {
            if (trigger.uid == data.trigger_uid) {
                $scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
            }
        });

        if ($scope.current_trigger && $scope.current_trigger.uid == data.trigger_uid) {
            delete $scope.current_trigger;
        }

        flash.success = $translate('Trigger removed');
    });

    /** @todo Избавится от new */
    $scope.submit = function() {
        var uid = $scope.current_trigger.uid;
        if (!uid) {
            uid = 'new';
        }

        var trigger = {
            uid: uid,
            name: $scope.current_trigger.name,
            priority: $scope.current_trigger.priority,
            event: $scope.current_trigger.event,
            event_params: $scope.current_trigger.event_params,
            result: $scope.current_trigger.result,
            result_params: $scope.current_trigger.result_params
        };
        
        // Сохраняем триггер
        socket.emit('widget:setting:triggers:edit', { trigger: trigger, widget_uid: $rootScope.widget.uid });

        // Добавляем новый триггер в список триггеров
        // if (trigger_uid == 'new') {
        //     $scope.triggers.push(trigger);
        // }

        delete $scope.current_trigger;
    };

    $scope.remove = function() {
        // Удаляем триггер
        socket.emit('widget:setting:triggers:remove', { trigger_uid: $scope.current_trigger.uid, widget_uid: $rootScope.widget.uid });

        $scope.triggers.splice($scope.triggers.indexOf($scope.current_trigger), 1);
        delete $scope.current_trigger;
    };

    $scope.events = {
        1: {name: $translate('WIDGET CREATED'), param: false },
        2: {name: $translate('WORD SEND'), param: true },
        3: {name: $translate('TIME ONE PAGE'), param: true },
        4: {name: $translate('VISIT PAGE'), param: true },
        5: {name: $translate('VISIT FROM URL'), param: true },
        6: {name: $translate('VISIT FROM KEYWORD'), param: true },
        7: {name: $translate('WIDGET OPENED'), param: false },
        8: {name: $translate('WIDGET CLOSED'), param: false },
        9: {name: $translate('MESSAGE START'), param: false },
        10: {name: $translate('MESSAGE SEND'), param: false }
    };

    $scope.results = {
        1: {name: $translate('SEND MESSAGE'), param: true },
        2: {name: $translate('ALERT OPERATORS'), param: false },
        3: {name: $translate('OPEN WIDGET'), param: false },
        4: {name: $translate('BELL WIDGET'), param: false }
    };

    $scope.add = function() {
        $scope.current_trigger = {};
    };

    $scope.select = function(trigger) {
        $scope.current_trigger = trigger;
    };

    $scope.close = function() {
        delete $scope.current_trigger;
    }
}