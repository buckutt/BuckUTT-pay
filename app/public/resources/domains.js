/////////////////////////////
// School Domains resource //
/////////////////////////////

'use strict';

pay.factory('Domain', ['$Resource', function ($resource) {
    return $resource('api/domains/:id', {}, {
        delete: {
            method: 'DELETE',
            url: 'api/domains/:id'
        }
    });
}]);
