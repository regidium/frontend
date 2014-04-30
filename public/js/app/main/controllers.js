'use strict';

function MainCtrl() {}

function MainAuthExternalServiceConnectCtrl($scope, $location, $routeParams, $http, sha1, flash) {
    $location.url('/login');
    $http.get('/auth/external/service/' + $routeParams.provider + '/connect').
        success(function(data, status, headers, config) {
            if (data && data.link) {
                window.location = data.link;
            } else {
                flash.error = 'Backend return error request!';
            }
        }).
        error(function(data, status, headers, config) {
            if (data && data.errors) {
                $rootScope.log(data.errors);
                flash.error = data.errors;
            } else {
                $rootScope.log('System error!');
                flash.error = 'System error!';
            }
    });
}

/** @todo Update */
function MainAuthExternalServiceDisconnectCtrl() {

}

function MainAuthLoginCtrl($scope, $location, $http, sha1, flash) {
    $scope.agent = {
        email: '',
        password: ''
    };

    if ($location.path() === '/login') {
        $('#login').modal('show');
    }

    /** todo Валилидация данных */
    $scope.login = function() {
        var email = $scope.agent.email;
        var password = sha1.encode($scope.agent.password);

        $http.post('/login', { email: email, password: password }).
            success(function(data, status, headers, config) {
                if (data && data.agent.uid) {
                    window.location = '/agent';
                } else {
                    _.each(data.errors, function(val, key) {
                        flash.error = val;
                    });
                }
            }).error(function(data, status, headers, config) {
                if (data && data.errors) {
                    $rootScope.log(data.errors);
                    flash.error = data.errors;
                } else {
                    $rootScope.log('System error!');
                    flash.error = 'System error!';
                }
        });
    };
}

function MainAuthRegistrationCtrl($rootScope, $scope, $location, $http, sha1, flash) {
    var ua = UAParser('');

    $scope.agent = {
        first_name: '',
        last_name: '',
        email: '',
        password: undefined,
        confirm_password: undefined,
        language: $rootScope.lang,
        device: (ua.device.name ? ua.device.name : '') + ' ' + (ua.device.version ? ua.device.version : ''),
        os: ua.os.name + ' ' + ua.os.version,
        browser: ua.browser.name + ' ' + ua.browser.version
    };

    if ($location.path() === '/registration') {
        $('#registration').modal('show');
    }

    /** todo Валилидация данных */
    $scope.registration = function() {
        var agent = {
            first_name: $scope.agent.first_name,
            last_name: $scope.agent.last_name,
            email: $scope.agent.email,
            password: sha1.encode($scope.agent.password),
            confirm_password: sha1.encode($scope.agent.confirm_password),
        };

        $http.post('/registration', agent).
            success(function(data, status, headers, config) {
                if (data && data.uid) {
                    window.location = '/agent';
                } else {
                    flash.error = 'Backend return error request!';
                }
            }).
            error(function(data, status, headers, config) {
                if (data && data.errors) {
                    $rootScope.log(data.errors);
                    flash.error = data.errors;
                } else {
                    $rootScope.log('System error!');
                    flash.error = 'System error!';
                }
        });
    };
}