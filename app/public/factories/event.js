// Pay - /app/public/factories/event.js

// Event resource

'use strict';

pay.factory('Event', ['$Resource', function ($resource) {
    return $resource('api/events/:id');
}]);