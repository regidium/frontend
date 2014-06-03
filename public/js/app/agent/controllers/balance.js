'use strict';

/**
 * @url "/agent/balance/payment"
 */
function AgentBalancePaymentCtrl($rootScope, $scope, $log, socket, flash, blockUI) {
    // Определяем блоки блокировки
    var paymentBlockUI = blockUI.instances.get('paymentBlockUI');

    $scope.payment = {};

    $scope.paymentSubmit = function() {
        $scope.payment.sum = parseFloat($scope.payment.sum);
        socket.emit('widget:payment:made', { payment: $scope.payment, agent_uid: $rootScope.agent.uid, widget_uid: $rootScope.widget.uid });

        // Активируем оижадющие блоки
        paymentBlockUI.start();
    };

    // Транзакция создана
    socket.on('widget:payment:transaction', function(data) {
        $log.debug('Socket widget:payment:transaction', data);

        if (data.errors || data.error) {
            if (data.errors) {
                angular.forEach(data.errors, function(error) {
                    flash.error = error;
                });
            } else if (data.error && data.error.message) {
                flash.error = data.error.message;
            }
        } else {
            // Яндекс.Деньги
//            if (data.payment_method == $rootScope.c.PAYMENT_METHOD_YANDEX_MONEY) {
//                data.payment_method = 'PC';
//            } else if (data.payment_method == $rootScope.c.PAYMENT_METHOD_YANDEX_MONEY) {
//                data.payment_method = 'AC';
//            }
//            $scope.transaction = data.transaction;
//            angular.element('#transaction_form input[name="sum"]').val(data.transaction.sum);
//            angular.element('#transaction_form input[name="receiver"]').val(data.transaction.receiver);
//            angular.element('#transaction_form input[name="label"]').val(data.transaction.uid);
//            angular.element('#transaction_form input[name="paymentType"]').val(data.transaction.paymentType);
//            angular.element('#transaction_form input[name="targets"]').val(data.transaction.number);
//
//            angular.element('#transaction_form').submit();
            // ROBOKASSA
            $scope.transaction = data.transaction;

            angular.element('#pay').attr('href', data.url);
            angular.element('#pay').click();
        }

        // Разблокировка ожидающих блоков
        paymentBlockUI.stop();
    });
}

/**
 * @url "/agent/balance/payment/success"
 */
function AgentBalancePaymentSuccessCtrl($location, $translate, flash) {
    flash.success = $translate('Payment success');
    $location.path('/agent');
}

/**
 * @url "/agent/balance/payment/fail"
 */
function AgentBalancePaymentFailCtrl($location, $translate, flash) {
    flash.success = $translate('Payment failed');
    $location.path('/agent');
}

/**
 * @url "/agent/balance/plan"
 */
function AgentBalancePlanCtrl($rootScope, $scope, $location, $translate, socket) {
    $scope.plan = $rootScope.widget.plan;

    $scope.submit = function() {
        socket.emit('widget:plan:change', { plan: $scope.plan, widget_uid: $rootScope.widget.uid });

        flash.success = $translate('Plan changed');

        $location.path('/agent/settings/widget');
    }
}