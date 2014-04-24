'use strict';

function security($cookieStore) {
    var agent = $cookieStore.get('agent');

    if (agent) {
        agent.first_name = decodeURIComponent(agent.first_name);
        return agent;
    }

    window.location = '/login';
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
function AgentSettingsWidgetStyleCtrl($scope, $cookieStore, socket, blockUI) {
    $scope.agent = security($cookieStore);
    $scope.settings = {};
    $scope.current_menu = 'style';
    // Определяем блоки блокировки
    var styleBlockUI = blockUI.instances.get('styleBlockUI');
    var menuBlockUI = blockUI.instances.get('menuBlockUI');

    // Делаем запрос информации о виджете
    socket.emit('widget:info:get', { widget_uid: $scope.agent.widget.uid });

    // Блокируем ожидающие блоки
    styleBlockUI.start();
    menuBlockUI.start();

    // Event сервер прислала информацию о виджете
    socket.on('widget:info:sended', function(data) {
        $scope.settings = data.settings;

        // Разблокировка ожидающих блоков
        styleBlockUI.stop(); 
        menuBlockUI.stop(); 
    })

    // Настройки стялей виджета изменены
    socket.on('widget:setting:style:edited', function(data) {
        $scope.settings = data.settings;
    })

    $scope.submit = function() {
        // Сохраняем настройки
        socket.emit('widget:setting:style:edit', { settings: $scope.settings, widget_uid: $scope.agent.widget.uid });
    }
}

/**
 * @url "/agent/widget/code"
 */
function AgentSettingsWidgetCodeCtrl($scope, $cookieStore, $location) {
    var agent = security($cookieStore);
    $scope.widget_uid = agent.widget.uid;
    $scope.current_menu = 'code';
}

/**
 * @todo Убрать Widgets
 * @url "/agent/widget/pay"
 */
function AgentSettingsWidgetPayCtrl($scope, $cookieStore, $location, Widgets) {
    var agent = security($cookieStore);
    $scope.pay = {};
    $scope.current_menu = 'pay';

    $scope.submit = function() {
        alert('В этом месте будет редирект на систему online оплаты. При положительном ответе, оплаченная сумма будет внесена на счет клиента');
        Widgets.pay({}, { uid: agent.widget.uid, payment_method: $scope.pay.payment_method, amount: $scope.pay.amount }, function(data) {
            // @todo Делать запрос в платежную систему, по возврату зачислять оплату и выводить страницу выбора плана
            $location.path('/agent/settings/widget');
        });
    }
}

/**
 * @todo Убрать Widgets
 * @url "/agent/widget/plan"
 */
function AgentSettingsWidgetPlanCtrl($scope, $cookieStore, $location, Widgets) {
    var agent = security($cookieStore);
    $scope.widget = {};
    $scope.current_menu = 'plan';

    $scope.submit = function() {
        Widgets.plan({}, { uid: agent.widget.uid, plan: $scope.widget.plan }, function(data) {
            $location.path('/agent/settings/widget');
        });
    }
}

/**
 * @url "/agent/widget/triggers"
 */
function AgentSettingsWidgetTriggersCtrl($rootScope, $scope, $cookieStore, $location, socket, blockUI, Widgets) {
    var agent = security($cookieStore);
    var widget_uid = agent.widget.uid;
    //$scope.current_trigger = {};
    // Определяем блоки блокировки
    var triggerBlockUI = blockUI.instances.get('triggerBlockUI');
    var menuBlockUI = blockUI.instances.get('menuBlockUI');

    // Делаем запрос информации о виджете
    socket.emit('widget:info:get', { widget_uid: agent.widget.uid });

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
            result_params: $scope.current_trigger.result_params,
        }
        
        // Сохраняем триггер
        socket.emit('widget:setting:triggers:edit', { trigger: trigger, widget_uid: agent.widget.uid });

        // Добавляем новый триггер в список триггеров
        // if (trigger_uid == 'new') {
        //     $scope.triggers.push(trigger);
        // }

        delete $scope.current_trigger;
    }

    $scope.remove = function() {
        // Удаляем триггер
        socket.emit('widget:setting:triggers:remove', { trigger_uid: $scope.current_trigger.uid, widget_uid: agent.widget.uid });

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

/**
 * @todo
 * @url "/agent/settings/productivity"
 */
function AgentSettingsProductivityCtrl($scope, $cookieStore) {
    security($cookieStore);
}