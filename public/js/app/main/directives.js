(function(angular) {

    'use strict';

    /* Directives */
    angular.module('regidiumApp.mainDirectives', [])
        .directive('authLogin', function() {
            return {
                restrict: 'A',
                templateUrl: '/js/app/main/views/auth/login.html'
            };
        })
        .directive('authRegistration', function() {
            return {
                restrict: 'A',
                templateUrl: '/js/app/main/views/auth/registration.html'
            };
        })
    ;

})(angular);