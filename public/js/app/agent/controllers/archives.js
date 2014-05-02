'use strict';

/**
 * @todo Внедрить пагинацию
 * @url "/agent/archives"
 */
function AgentArchivesCtrl($rootScope, $scope, $log, socket, blockUI) {
    // Определяем блоки блокировки
    var archivesBlockUI = blockUI.instances.get('archivesBlockUI');

    $scope.chats = {};

    // Запрашиваем список архивных чатов
    socket.emit('chat:archives', { widget_uid: $rootScope.widget.uid });
    // Блокируем ожидающие блоки
    archivesBlockUI.start();

    // Получаем список архивных чатов
    socket.on('chat:archives:list', function(data) {
        $log.debug('Socket chat:archives:list', data);

        // Наполняем список архивных чатов
        $scope.chats = data;

        // Разблокировка ожидающих блоков
        archivesBlockUI.stop(); 
    });
}