////////////////////////
// BankPrice resource //
////////////////////////

'use strict';

pay.factory('BankPrice', ['$Resource', function ($resource) {
    return $resource('api/bankPrice/:id');
}]);
