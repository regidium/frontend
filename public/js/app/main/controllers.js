'use strict';

function MainCtrl() {}

function MainAuthExternalServiceConnectCtrl($scope, $location, $routeParams, $resource, sha1, flash) {
    $location.url('/login');
    var Login = $resource('/auth/external/service/' + $routeParams.provider + '/connect', {}, {
        get: { method: 'GET', params: {} }
    });

    var resp = Login.get({}, function(data) {
        window.location = data.link;
    });
}

function MainAuthExternalServiceDisconnectCtrl() {

}

function MainAuthLogoutCtrl($scope, $resource) {
    $scope.logout = function() {
        var Logout = $resource('/logout', {}, {
            query: { method: 'GET', params: {} }
        });

        Logout.query({}, function() {
            window.location = '/';
        });
    }
}

function MainAuthLoginCtrl($scope, $location, $resource, sha1, flash) {
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
        var Login = $resource('/login', {}, {
            post: { method: 'POST', data: { email: '@email', password: '@password' } }
        });
        Login.post({}, { email: email, password: password }, function(data, getResponseHeaders) {
            if (data && data.user) {
                window.location = '/user';
            } else if (data && data.agent) {
                window.location = '/agent';
            } else {
                flash.error = 'Backend return error request!';
            }
        }, function(error, getResponseHeaders) {
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

function MainAuthRegisterCtrl($scope, $location, $resource, sha1, flash) {
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
        var Register = $resource('/register', {}, {
            post: { method: 'POST', data: { fullname: '@fullname', email: '@email', password: '@password' } }
        });
        Register.post({}, { fullname: fullname, email: email, password: password }, function(data, getResponseHeaders) {
            if (data && data.user) {
                window.location = '/user';
            } else if (data && data.agent) {
                window.location = '/agent';
            } else {
                flash.error = 'Backend return error request!';
            }
        }, function(error, getResponseHeaders) {
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