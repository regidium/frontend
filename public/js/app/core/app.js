'use strict';

var app = angular.module('regidiumApp', [
    'chieffancypants.loadingBar',
    'flash',
    'restangular',
    'angular-underscore',
    'regidiumApp.directives'
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://api.regidium.loc/app_dev.php/api/v1');
    RestangularProvider.setRequestSuffix('.json');
});