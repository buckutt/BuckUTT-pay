/////////////////////
// Reload resource //
/////////////////////

'use strict';

pay.factory('Reloads', ['$Resource', function ($resource) {
    return $resource('api/reloads');
}]);

pay.factory('Purchases', ['$Resource', function ($resource) {
    return $resource('api/purchases');
}]);
