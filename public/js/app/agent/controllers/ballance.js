'use strict';

/**
 * @url "/agent/ballance"
 */
function AgentBallanceCtrl($scope) {
}

/**
 * @todo Делать запрос в платежную систему, по возврату зачислять оплату и выводить страницу выбора плана
 * @url "/agent/ballance/pay"
 */
function AgentBallancePayCtrl($rootScope, $scope, $location, socket) {
    $scope.pay = {};
    $scope.current_menu = 'pay';

    $scope.submit = function() {
        alert('В этом месте будет редирект на систему online оплаты. При положительном ответе, оплаченная сумма будет внесена на счет клиента');

        socket.emit('widget:payment:made', { pay: $scope.pay, widget_uid: $rootScope.widget.uid });

        $location.path('/agent/settings/widget');
    }
}

/**
 * @url "/agent/ballance/plan"
 */
function AgentBallancePlanCtrl($rootScope, $scope, $location, socket) {
    $scope.plan = $rootScope.widget.plan;
    $scope.current_menu = 'plan';

    $scope.submit = function() {
        socket.emit('widget:plan:change', { plan: $scope.plan, widget_uid: $rootScope.widget.uid });

        $location.path('/agent/settings/widget');
    }
}