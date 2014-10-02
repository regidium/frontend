/**
 *  Agent application constants
 */
(function(angular){
    'use strict';

    angular.module('regidiumApp')
        .constant('angularMomentConfig',{
            preprocess: 'unix',
            // TODO: implement timezone logic
            timezone: 'Europe/London'
        });

})(angular);