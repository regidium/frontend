'use strict';

/**
 * @url "/agent/settings/triggers"
 */
function AgentSettingsTriggersCtrl($rootScope, $scope, socket, blockUI, flash) {
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
    })

    // Настройки триггеров виджета изменены
    socket.on('widget:setting:triggers:edited', function(data) {
        var exists = false;
        var triggers = [];

        angular.forEach($scope.triggers, function(trigger) {
            if (trigger.uid == data.trigger.uid) {
                trigger = data.trigger;
                this.push(trigger)
                exists = true;
            }
        }, triggers);
        $scope.triggers = triggers;

        if (exists == false) {
            $scope.triggers.push(data.trigger);
        }

        flash.success = 'Trigger saved';
    })

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

        flash.success = 'Trigger removed';
    })

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
        }
        
        // Сохраняем триггер
        socket.emit('widget:setting:triggers:edit', { trigger: trigger, widget_uid: $rootScope.widget.uid });

        // Добавляем новый триггер в список триггеров
        // if (trigger_uid == 'new') {
        //     $scope.triggers.push(trigger);
        // }

        delete $scope.current_trigger;
    }

    $scope.remove = function() {
        // Удаляем триггер
        socket.emit('widget:setting:triggers:remove', { trigger_uid: $scope.current_trigger.uid, widget_uid: $rootScope.widget.uid });

        $scope.triggers.splice($scope.triggers.indexOf($scope.current_trigger), 1);
        delete $scope.current_trigger;
    }

    $scope.events = {
        1: {name: 'WIDGET CREATED', param: false },
        2: {name: 'WORD SEND', param: true },
        3: {name: 'TIME ONE PAGE', param: true },
        4: {name: 'VISIT PAGE', param: true },
        5: {name: 'VISIT FROM URL', param: true },
        6: {name: 'VISIT FROM KEYWORD', param: true },
        7: {name: 'WIDGET OPENED', param: false },
        8: {name: 'WIDGET CLOSED', param: false },
        9: {name: 'MESSAGE START', param: false },
        10: {name: 'MESSAGE SEND', param: false }
    };

    $scope.results = {
        1: {name: 'SEND MESSAGE', param: true },
        2: {name: 'ALERT OPERATORS', param: false },
        3: {name: 'OPEN WIDGET', param: false },
        4: {name: 'BELL WIDGET', param: false }
    };
    // $scope.events = {
    //     $rootScope.c.TRIGGER_EVENT_WIDGET_CREATED: {name: 'WIDGET CREATED', param: false },
    //     $rootScope.c.TRIGGER_EVENT_WORD_SEND: {name: 'WORD SEND', param: true },
    //     $rootScope.c.TRIGGER_EVENT_TIME_ONE_PAGE: {name: 'TIME ONE PAGE', param: true },
    //     $rootScope.c.TRIGGER_EVENT_VISIT_PAGE: {name: 'VISIT PAGE', param: true },
    //     $rootScope.c.TRIGGER_EVENT_VISIT_FROM_URL: {name: 'VISIT FROM URL', param: true },
    //     $rootScope.c.TRIGGER_EVENT_VISIT_FROM_KEY_WORD: {name: 'VISIT FROM KEYWORD', param: true },
    //     $rootScope.c.TRIGGER_EVENT_CHAT_OPENED: {name: 'WIDGET OPENED', param: false },
    //     $rootScope.c.TRIGGER_EVENT_CHAT_CLOSED: {name: 'WIDGET CLOSED', param: false },
    //     $rootScope.c.TRIGGER_EVENT_MESSAGE_START: {name: 'MESSAGE START', param: false },
    //     $rootScope.c.TRIGGER_EVENT_MESSAGE_SEND: {name: 'MESSAGE SEND', param: false }
    // };

    // $scope.results = {
    //     $rootScope.c.TRIGGER_RESULT_MESSAGE_SEND: {name: 'SEND MESSAGE', param: true },
    //     $rootScope.c.TRIGGER_RESULT_AGENTS_ALERT: {name: 'ALERT OPERATORS', param: false },
    //     $rootScope.c.TRIGGER_RESULT_WIDGET_OPEN: {name: 'OPEN WIDGET', param: false },
    //     $rootScope.c.TRIGGER_RESULT_WIDGET_BELL: {name: 'BELL WIDGET', param: false }
    // };

    $scope.new = function() {
        $scope.current_trigger = {};
    }

    $scope.select = function(trigger) {
        $scope.current_trigger = trigger;
    }

    $scope.close = function() {
        delete $scope.current_trigger;
    }
}