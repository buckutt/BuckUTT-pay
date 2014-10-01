// Pay - /app/public/app.js

// Main entry point

'use strict';

var pay = angular.module('pay', [
    'ngRoute',
    'ngResource'
]);

pay.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'ticketsList/ticketsList.html'
    });

    $routeProvider.when('/etuAuth', {
        templateUrl: 'etuAuth/etuAuth.html'
    });
}]);
