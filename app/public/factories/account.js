// Pay - /app/public/factories/account.js

// Account resource

'use strict';

pay.factory('Account', ['$Resource', function ($resource) {
    return $resource('api/accounts/:id');
}]);