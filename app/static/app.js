// Pay - /app/static/app.js

// Main entry point
'use strict';

var pay = angular.module('pay', [
    'ngRoute'
]);

pay.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'ticketsList/ticketsList.html',
        controller: 'ticketsList'
    });
}]);
