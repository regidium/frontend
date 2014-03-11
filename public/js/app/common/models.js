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
        .factory('Widgets', function($rootScope, $resource) {
            return $resource($rootScope.config.apiUrl + 'widgets', null, {
                all: { method: 'GET', url: $rootScope.config.apiUrl + 'widgets', isArray:true },
                one: { method: 'GET', url: $rootScope.config.apiUrl + 'widgets/:uid' },
                create: { method: 'POST', url: $rootScope.config.apiUrl + 'widgets' },
                edit: { method: 'PUT', url: $rootScope.config.apiUrl + 'widgets/:uid' },
                remove: { method: 'DELETE', url: $rootScope.config.apiUrl + 'widgets/:uid' },
                pay: { method: 'POST', params: { uid: "@uid", payment_method: "@payment_method", amount: "@amount" }, url: $rootScope.config.apiUrl + 'widgets/:uid/pays/:payment_method' },
                plan: { method: 'PUT', params: { uid: "@uid", plan: "@plan" }, url: $rootScope.config.apiUrl + 'widgets/:uid/plans/:plan' },
                users: { method: 'GET', params: { uid: "@uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/users', isArray: true },
                agents: { method: 'GET', params: { uid: "@uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/agents', isArray: true },
                saveAgent: { method: 'PUT', params: { uid: "@uid", agent: "@agent" }, url: $rootScope.config.apiUrl + 'widgets/:uid/agents/:agent' },
                saveSettings: { method: 'PUT', params: { uid: "@uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/settings' },
                getTriggers: { method: 'GET', params: { uid: "@uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/triggers', isArray: true },
                saveTrigger: { method: 'PUT', params: { uid: "@uid", trigger_uid: "@trigger_uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/triggers/:trigger_uid' },
                deleteTrigger: { method: 'DELETE', params: { uid: "@uid", trigger_uid: "@trigger_uid" }, url: $rootScope.config.apiUrl + 'widgets/:uid/triggers/:trigger_uid' },
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