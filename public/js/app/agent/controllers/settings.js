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
    $scope.current_menu = 'style';

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
 * @url "/agent/widget/code"
 */
function AgentSettingsWidgetCodeCtrl($scope, $cookieStore, $location, Widgets) {
    var person = security($cookieStore);
    $scope.widget_uid = person.agent.widget.uid;
    $scope.current_menu = 'code';
}

/**
 * @url "/agent/widget/pay"
 */
function AgentSettingsWidgetPayCtrl($scope, $cookieStore, $location, Widgets) {
    var person = security($cookieStore);
    $scope.pay = {};
    $scope.current_menu = 'pay';

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
    $scope.current_menu = 'plan';

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