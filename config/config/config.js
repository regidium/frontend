(function(angular) {

    'use strict';

    /* Services */
    angular.module('regidiumApp')
        .factory('config', function ($rootScope) {

            $rootScope.config = {};
            $rootScope.config.widgetUrl = 'http://widget.regidium.dev/';
            $rootScope.config.apiUrl = 'http://api.regidium.dev/api/v1/'
            $rootScope.config.fsUrl = 'http://fs.regidium.dev/';
            $rootScope.config.server = {};
            $rootScope.config.server.io_url = 'http://io.regidium.dev';
            $rootScope.config.server.io_port = '5000';

            return $rootScope;
        });

})(angular);
