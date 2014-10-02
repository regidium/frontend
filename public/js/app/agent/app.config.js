/**
 *  Agent application configuration
 */
(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .config(config);

    function config($translateProvider, $logProvider, flashProvider) {

        // Настраиваем переводчик
        $translateProvider.useStaticFilesLoader({
            prefix: 'js/app/agent/translations/',
            suffix: '.json'
        });

        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');

        // Выводим сообщения в консоль только для окружения разработки
        if (env === 'development') {
            $logProvider.debugEnabled(true);
            $translateProvider.useMissingTranslationHandlerLog();
        }

        // Настраиваем классы всплывающих сообщений
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.warnClassnames.push('alert-warning');
        flashProvider.infoClassnames.push('alert-info');
        flashProvider.successClassnames.push('alert-success');

    }

})(angular);