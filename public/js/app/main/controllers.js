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

/** @todo Update */
function MainAuthExternalServiceDisconnectCtrl() {

}

function MainAuthLoginCtrl($scope, $location, $http, sha1, flash) {
    $scope.person = {
        email: '',
        password: ''
    };

    if ($location.path() === '/login') {
        $('#login').modal('show');
    }

    /** todo Валилидация данных */
    $scope.login = function() {
        var email = $scope.person.email;
        var password = sha1.encode($scope.person.password);

        $http.post('/login', { email: email, password: password }).
            success(function(data, status, headers, config) {
                if (data && data.model_type == 'person') {
                    window.location = '/agent';
                } else {
                    _.each(data.errors, function(val, key) {
                        flash.error = val;
                    });
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

function MainAuthRegistrationCtrl($scope, $location, $http, sha1, flash) {
    $scope.person = {
        fullname: '',
        email: '',
        password: ''
    };

    if ($location.path() === '/registration') {
        $('#registration').modal('show');
    }

    /** todo Валилидация данных */
    $scope.registration = function() {
        var fullname = $scope.person.fullname;
        var email = $scope.person.email;
        var password = sha1.encode($scope.person.password);

        $http.post('/registration', { fullname: fullname, email: email, password: password }).
            success(function(data, status, headers, config) {
                if (data && data.person && data.person.model_type == 'person') {
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