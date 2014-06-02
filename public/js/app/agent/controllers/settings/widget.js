'use strict';

/**
 * @url "/agent/widget/style"
 */
function AgentSettingsWidgetStyleCtrl($rootScope, $scope, $http, $fileUploader, $translate, socket, blockUI, flash) {
    $scope.settings = {};
    // Определяем блоки блокировки
    var styleBlockUI = blockUI.instances.get('styleBlockUI');
    var menuBlockUI = blockUI.instances.get('menuBlockUI');

    // Делаем запрос информации о виджете
    socket.emit('widget:info:get', { widget_uid: $rootScope.widget.uid });

    // Блокируем ожидающие блоки
    styleBlockUI.start();
    menuBlockUI.start();

    // Event сервер прислала информацию о виджете
    socket.on('widget:info:sended', function(data) {
        $scope.settings = data.settings;

        // Разблокировка ожидающих блоков
        styleBlockUI.stop(); 
        menuBlockUI.stop(); 
    });

    // Настройки стялей виджета изменены
    socket.on('widget:setting:style:edited', function(data) {
        $scope.settings = data.settings;

        flash.success = $translate('Widget style edited');
    });

    // Определяем загрузчик файлов
    var uploader = $scope.uploader = $fileUploader.create({
        queueLimit: 1,
        autoUpload: true,
        removeAfterUpload: true,
        scope: $scope,
        url: $rootScope.config.fsUrl + 'upload/' + $rootScope.widget.uid + '/widget/logo',
        filters: [
            function(item) {
                var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
                type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        ]
    });

    // Добавляем обрабочик загрузки файла
    uploader.bind('success', function (event, xhr, item, response) {
        if (response && response.url) {
            $scope.settings.company_logo = response.url;
            $rootScope.t = (+new Date);
            $scope.$apply();
        }
    });

    $scope.removeLogo = function() {
        $http.delete($rootScope.config.fsUrl + $rootScope.widget.uid)
            .success(function(data, status, headers, config) {
                if (data && data.success) {
                    $scope.settings.company_logo = '';
                    flash.success = 'Widget logo removed';
                } else if (data && data.errors) {
                    $log.debug(data.errors);
                    flash.error = data.errors;
                } else {
                    $log.debug(data);
                    flash.error = 'System error!';
                }
            }).error(function(data, status, headers, config) {
                if (data && data.errors) {
                    $log.debug(data.errors);
                    flash.error = data.errors;
                } else {
                    $log.debug('System error');
                    flash.error = $translate('System error');
                }
        });
    };

    $scope.submit = function() {
        // Сохраняем настройки
        socket.emit('widget:setting:style:edit', { settings: $scope.settings, widget_uid: $rootScope.widget.uid });
    };
}

/**
 * @url "/agent/widget/code"
 */
function AgentSettingsWidgetCodeCtrl($rootScope, $scope) {
    $scope.widget_uid = $rootScope.widget.uid;
}