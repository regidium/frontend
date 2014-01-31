(function() {

    'use strict';

    /* Services */
    /** @todo Внедрить пагинацию */
    angular.module('regidiumApp')
        .factory('Users', function ($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'users', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'users', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'users/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'users' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'users/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'users/:uid' },
                allChats: { method: 'GET', url: $rootScope.config.apiUrl + 'users/:uid/chats', isArray:true }
            });
        })
        .factory('Agents', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'agents', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'agents', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'agents/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'agents' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'agents/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'agents/:uid' },
                connectToChat: { method: 'PUT', params: { uid: '@uid', chat: '@chat' }, url: $rootScope.config.apiUrl + 'agents/:uid/chats/:chat' }
            });
        })
        .factory('Clients', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'clients', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'clients', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'clients/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'clients' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'clients/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'clients/:uid' },
                pay: { method: 'POST', params: { uid: "@uid", payment_method: "@payment_method", amount: "@amount" }, url: $rootScope.config.apiUrl + 'clients/:uid/pays/:payment_method' },
                plan: { method: 'PUT', params: { uid: "@uid", plan: "@plan" }, url: $rootScope.config.apiUrl + 'clients/:uid/plans/:plan' }
            });
        })
        .factory('Chats', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'chats', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'chats', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'chats/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'chats' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'chats/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'chats/:uid' }
            });
        })
        .factory('ChatsMessages', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'chats/messages', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'chats/messages', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'chats/messages/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'chats/messages' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'chats/messages/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'chats/messages/:uid' }
            });
        })
        .factory('Plans', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'plans', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'plans', isArray:true }
            });
        })
        .factory('PaymentMethods', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'paymentmethods', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'paymentmethods', isArray:true }
            });
        })
    ;

})();