// Pay - /app/ticketsList/ticketsList.js

// Controller for tickets list
'use strict';

// pay.module is not defined
angular.module('pay.ticketsList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'ticketsList/ticketsList.html',
    controller: 'ticketsList'
  });
}])

.controller('ticketsList', [function() {
}]);