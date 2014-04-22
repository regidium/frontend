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
    $scope.agent = security($cookieStore);
    $scope.settings = {};
    $scope.current_menu = 'style';

    Widgets.one({ uid: $scope.agent.widget.uid }, function(data) {
        $scope.settings = data.settings;
    });

    $scope.submit = function() {
        Widgets.saveSettings({ uid: $scope.agent.widget.uid }, $scope.settings);
    }
//    $scope.widget = Widgets.one({ uid: agent.widget..uid });

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
 * @url "/agent/widget/code"
 */
function AgentSettingsWidgetCodeCtrl($scope, $cookieStore, $location, Widgets) {
    var agent = security($cookieStore);
    $scope.widget_uid = agent.widget.uid;
    $scope.current_menu = 'code';
}

/**
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
 * @url "/agent/widget/plan"
 */
function AgentSettingsWidgetTriggersCtrl($scope, $cookieStore, $location, Widgets) {
    var agent = security($cookieStore);
    var widget_uid = agent.widget.uid;
    //$scope.current_trigger = {};

    Widgets.getTriggers({uid: widget_uid}, function(data) {
        $scope.triggers = data;
    });

    $scope.events = {
        1: {name: 'EVENT_WIDGET_CREATED', param: false },
        2: {name: 'EVENT_WORD_SEND', param: true },
        3: {name: 'EVENT_TIME_ONE_PAGE', param: true },
        4: {name: 'EVENT_VISIT_PAGE', param: true },
        5: {name: 'EVENT_VISIT_FROM_URL', param: true },
        6: {name: 'EVENT_VISIT_FROM_KEY_WORD', param: true },
        7: {name: 'EVENT_CHAT_OPENED', param: false },
        8: {name: 'EVENT_CHAT_CLOSED', param: false },
        9: {name: 'EVENT_MESSAGE_START', param: false },
        10: {name: 'EVENT_MESSAGE_SEND', param: false }
    };

    $scope.results = {
        1: {name: 'RESULT_MESSAGE_SEND', param: true },
        2: {name: 'RESULT_OPERATORS_ALERT', param: false },
        3: {name: 'RESULT_WIDGET_OPEN', param: false },
        4: {name: 'RESULT_WIDGET_BELL', param: false }
    };

    $scope.new = function() {
        $scope.current_trigger = {};
    }

    $scope.select = function(trigger) {
        $scope.current_trigger = trigger;
    }

    $scope.close = function(trigger) {
        delete $scope.current_trigger;
    }

    $scope.submit = function(trigger) {
        var trigger_uid = trigger.uid;
        if (!trigger_uid) {
            trigger_uid = 'new';
        }
        Widgets.saveTrigger({ uid: widget_uid, trigger_uid: trigger_uid }, $scope.current_trigger, function(data) {
            if (trigger_uid == 'new') {
                $scope.triggers.push(data);
            }
            delete $scope.current_trigger;
        });
    }

    $scope.remove = function(trigger) {
        Widgets.deleteTrigger({ uid: widget_uid, trigger_uid: trigger.uid }, {}, function(data) {
            $scope.triggers.splice($scope.triggers.indexOf(trigger), 1);
            delete $scope.current_trigger;
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