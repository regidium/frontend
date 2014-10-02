/**
 * Agent application language service
 */
(function(angular){

    'use strict';

    angular.module('regidiumApp')
        .factory('langService', langService)

    function langService($rootScope){
        return {

            /**
             * Return language
             * depends on agent settings if exists
             *
             * @returns {*}
             */
            getLang: function(){
                var lang;
                if ($rootScope.agent.language != 'auto') {
                    lang = $rootScope.agent.language;
                }else{
                    lang = getBrowserLang();
                }
                return lang;
            }
        }
    }

    /**
     * Detect browser language
     *
     * @returns {*|string}
     */
    function getBrowserLang(){
        var lang = navigator.browserLanguage || navigator.language || navigator.userLanguage;
        lang = lang.substring(0, 2);
        return lang;
    }


})(angular);