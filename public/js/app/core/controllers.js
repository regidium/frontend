'use strict';

angular.module('regidiumApp').controller('CoreCtrl', function ($scope, Restangular, sha1, flash) {
    $scope.login = function() {
        /** @todo Вызывать loading-состояние */
        var email = $scope.user.email;
        var password = sha1.encode($scope.user.password);
        var existUser = { email: email, password: password };
        var baseUsers = Restangular.all('users');
        var response = baseUsers.get(existUser);
        console.log(response);
        //$('#login').modal('hide');
    }

    $scope.register = function() {
        /** @todo Вызывать loading-состояние */
        var fullname = $scope.user.fullname;
        var email = $scope.user.email;
        var password = sha1.encode($scope.user.password);
        var newUser = { fullname: fullname, email: email, password: password };
        var baseUsers = Restangular.all('users');
        var response = baseUsers.post(newUser).then(function() {
            console.log("Object saved OK");
            /** @todo Redirect to panel */
            //$('#login').modal('hide');
        }, function($e) {
            if ($e && $e.data && $e.data.errors) {
                flash($e.data.errors);
                //_.each($e.data.errors, function(message, key) {});
            } else {
                flash('System error!');
            }
        });
    }
});