// Pay - /app/public/factories/resource.js

// Resource with PUT support for updates

'use strict';

pay.factory('$Resource', ['$resource', function ($resource) {
    return function (url, params, methods) {
        var defaults = {
            update: {
                method: 'put',
                isArray: false
            },
            create: {
                method: 'post'
            }
        };

        methods = angular.extend(defaults, methods);

        var resource = $resource(url, params, methods);

        resource.prototype.$save = function(callback) {
            if (!this.id) {
                return this.$create(callback);
            }
            else {
                return this.$update(callback);
            }
        };

        return resource;
    };
}]);