// Pay - /app/public/resources/tickets.js

// Ticket(s) resource

'use strict';

pay.factory('Ticket', ['$Resource', function ($resource) {
    return $resource('api/tickets/:id');
}]);

pay.factory('EventTickets', ['$Resource', function ($resource) {
    return $resource('api/events/:id/tickets/');
}]);