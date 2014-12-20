// Pay - /app/public/resources/domains.js

// School Domains resource

'use strict';

pay.factory('Domain', ['$Resource', function ($resource) {
    return $resource('api/domains/:id');
}]);
