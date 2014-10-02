(function(angular){

    'use strict';

    angular.module('regidiumApp')

    /**
     *  CSS Helper
     */
    .factory('cssHelper',cssHelper);

    function cssHelper() {
        return {
            /**
             * Return css class
             * depends on user OS
             *
             * @param os_string
             * @returns {string}
             */
            getOsClass: function (os_string) {
                if (os_string) {
                    os_string = angular.lowercase(os_string);
                    if (os_string.indexOf('linux') !== -1) {
                        return 'fa-linux';
                    } else if (os_string.indexOf('windows') !== -1) {
                        return 'fa-windows';
                    } else if (os_string.indexOf('apple') !== -1 || os_string.indexOf('ios') !== -1) {
                        return 'fa-apple';
                    } else if (os_string.indexOf('osx') !== -1) {
                        return 'fa-apple';
                    } else if (os_string.indexOf('android') !== -1) {
                        return 'fa-android';
                    } else {
                        return '';
                    }
                }
            },

            /**
             * Return cs class
             * depends on user browser
             *
             * @param browser_string
             * @returns {string}
             */
            getBrowserClass: function (browser_string) {
                if (browser_string) {
                    browser_string = angular.lowercase(browser_string);
                    if (browser_string.indexOf('chrome') !== -1) {
                        return 'icon-chrome';
                    } else if (browser_string.indexOf('firefox') !== -1) {
                        return 'icon-firefox';
                    } else if (browser_string.indexOf('opera') !== -1) {
                        return 'icon-opera';
                    } else if (browser_string.indexOf('internet explorer') !== -1 || browser_string.indexOf('ie') !== -1) {
                        return 'icon-ie';
                    } else {
                        return '';
                    }
                }
            }
        };
    }

})(angular);