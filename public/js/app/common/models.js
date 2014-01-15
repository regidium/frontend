(function() {

    'use strict';

    /* Services */
    /** @todo Внедрить пагинацию */
    angular.module('regidiumApp')
        .factory('Users', function ($rootScope, $resource) {
            return $resource($rootScope.apiUrl + 'users', null, {
                all: { method: 'GET', url: $rootScope.apiUrl + 'users', isArray:true },
                one: { method: 'GET', url: $rootScope.apiUrl + 'users/:uid' },
                create: { method: 'POST', url: $rootScope.apiUrl + 'users' },
                edit: { method: 'PUT', url: $rootScope.apiUrl + 'users/:uid' },
                remove: { method: 'DELETE', url: $rootScope.apiUrl + 'users/:uid' }
            });
        })
        .factory('Agents', function($rootScope, $resource) {
            return $resource($rootScope.apiUrl + 'agents', null, {
                all: { method: 'GET', url: $rootScope.apiUrl + 'agents', isArray:true },
                one: { method: 'GET', url: $rootScope.apiUrl + 'agents/:uid' },
                create: { method: 'POST', url: $rootScope.apiUrl + 'agents' },
                edit: { method: 'PUT', url: $rootScope.apiUrl + 'agents/:uid' },
                remove: { method: 'DELETE', url: $rootScope.apiUrl + 'agents/:uid' }
            });
        })
        .factory('Chats', function($rootScope, $resource) {
            return $resource($rootScope.apiUrl + 'chats', null, {
                all: { method: 'GET', url: $rootScope.apiUrl + 'chats', isArray:true },
                one: { method: 'GET', url: $rootScope.apiUrl + 'chats/:uid' },
                create: { method: 'POST', url: $rootScope.apiUrl + 'chats' },
                edit: { method: 'PUT', url: $rootScope.apiUrl + 'chats/:uid' },
                remove: { method: 'DELETE', url: $rootScope.apiUrl + 'chats/:uid' }
            });
        });

})();