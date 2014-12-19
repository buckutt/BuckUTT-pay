// Pay - /app/public/resources/account.js

// Account resource

'use strict';

pay.factory('Account', ['$Resource', function ($resource) {
    return $resource('api/events/:id/accounts');
}]);