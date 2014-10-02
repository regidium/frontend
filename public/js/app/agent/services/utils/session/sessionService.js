(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .factory('sessionService', sessionService)

    function sessionService($http, $log, $rootScope){
        return {

            /**
             * Populate agent session data
             *
             * @param cb
             */
            getSession: function(cb){

                var session_data = {};
                session_data.device = UAParser('').device.model + ' ' + UAParser('').device.vendor;
                session_data.os = UAParser('').os.name;
                session_data.browser = UAParser('').browser.name + ' ' + UAParser('').browser.version;
                session_data.language = $rootScope.lang;
                // Получаем IP, страну, город пользователя
                try {
                    $http.jsonp('http://api.sypexgeo.net/jsonp/?callback=JSON_CALLBACK').success(function(data) {
                        // @todo можно определять timezone (http://sypexgeo.net/ru/api/)
                        session_data.ip = data.ip;
                        session_data.country = data.country.name_en;
                        session_data.city = data.city.name_en;
                        cb(session_data);
                    });
                } catch(e) {
                    $log.debug('Ошибка получения IP, страны, города');
                    cb(session_data);
                }
            }
        }
    }

})(angular);