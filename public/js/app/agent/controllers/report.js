'use strict';

/**
 * @todo
 * @url "/agent/report/statistics"
 */
function AgentReportStatisticsCtrl($scope) {
}

'use strict';

/**
 * @todo Внедрить пагинацию
 * @url "/agent/report/history"
 */
function AgentReportHistoryCtrl($rootScope, $scope, $log, socket, blockUI) {
    // Определяем блоки блокировки
    var historyBlockUI = blockUI.instances.get('historyBlockUI');

    $scope.chats = {};

    // Запрашиваем список архивных чатов
    socket.emit('chat:archives', { widget_uid: $rootScope.widget.uid });
    // Блокируем ожидающие блоки
    historyBlockUI.start();

    // Получаем список архивных чатов
    socket.on('chat:archives:list', function(data) {
        $log.debug('Socket chat:archives:list', data);

        // Наполняем список архивных чатов
        $scope.chats = data;

        // Разблокировка ожидающих блоков
        historyBlockUI.stop(); 
    });
}