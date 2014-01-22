(function() {

    'use strict';

    /* Directives */
    angular.module('regidiumApp.mainDirectives', [])
        .directive('authLogin', function() {
            return {
                restrict: 'E',
                templateUrl: '/js/app/main/views/auth/login.html'
            };
        })
        .directive('authRegistration', function() {
            return {
                restrict: 'E',
                templateUrl: '/js/app/main/views/auth/registration.html'
            };
        })
    ;

})();