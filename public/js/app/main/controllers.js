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
                console.log(data.errors);
                flash.error = data.errors;
            } else {
                console.log('System error!');
                flash.error = 'System error!';
            }
    });
}

function MainAuthExternalServiceDisconnectCtrl() {

}

function MainAuthLoginCtrl($scope, $location, $http, sha1, flash) {
    $scope.user = {
        email: '',
        password: ''
    };

    if ($location.path() === '/login') {
        $('#login').modal('show');
    }

    /** todo Валилидация данных */
    $scope.login = function() {
        var email = $scope.user.email;
        var password = sha1.encode($scope.user.password);

        $http.post('/login', { email: email, password: password }).
            success(function(data, status, headers, config) {
                if (data && data.user) {
                    window.location = '/user';
                } else if (data && data.agent) {
                    window.location = '/agent';
                } else {
                    flash.error = 'Backend return error request!';
                }
            }).
            error(function(data, status, headers, config) {
                if (data && data.errors) {
                    console.log(data.errors);
                    flash.error = data.errors;
                } else {
                    console.log('System error!');
                    flash.error = 'System error!';
                }
        });
    };
}

function MainAuthRegisterCtrl($scope, $location, $http, sha1, flash) {
    $scope.user = {
        fullname: '',
        email: '',
        password: ''
    };

    if ($location.path() === '/register') {
        $('#register').modal('show');
    }

    /** todo Валилидация данных */
    $scope.register = function() {
        var fullname = $scope.user.fullname;
        var email = $scope.user.email;
        var password = sha1.encode($scope.user.password);

        $http.post('/register', { fullname: fullname, email: email, password: password }).
            success(function(data, status, headers, config) {
                if (data && data.user) {
                    window.location = '/user';
                } else if (data && data.agent) {
                    window.location = '/agent';
                } else {
                    flash.error = 'Backend return error request!';
                }
            }).
            error(function(data, status, headers, config) {
                if (data && data.errors) {
                    console.log(data.errors);
                    flash.error = data.errors;
                } else {
                    console.log('System error!');
                    flash.error = 'System error!';
                }
        });
    };
}