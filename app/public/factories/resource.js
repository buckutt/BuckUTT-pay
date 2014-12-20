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

        resource.prototype.$save = function (callback, errorCallback) {
            var self = $.extend(true, {}, this);
            var newCallback = function (e) {
                callback.call(self, e);
            };
            var newErrorCallback = function (e) {
                errorCallback.call(self, e);
            };
            if (!this.id) {
                return this.$create().then(newCallback, newErrorCallback);
            } else {
                return this.$update().then(newCallback, newErrorCallback);
            }
        };

        return resource;
    };
}]);
