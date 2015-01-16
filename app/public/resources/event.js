////////////////////
// Event resource //
////////////////////

'use strict';

pay.factory('Event', ['$Resource', function ($resource) {
    return $resource('api/events/:id');
}]);
