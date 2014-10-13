// Pay - /app/public/app.js

// Main entry point

'use strict';

var pay = angular.module('pay', [
    'ngRoute',
    'ngResource'
]);

pay.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'ticketsList/ticketsList.html'
        })
        .when('/etuAuth', {
            templateUrl: 'etuAuth/etuAuth.html'
        })
        .when('/admin', {
            templateUrl: 'admin/admin.html'
        })
        .when('/admin/event/:eventId', {
            templateUrl: 'adminEvent/adminEvent.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
