///////////////////////
// Back-end REST API //
///////////////////////

'use strict';

var rest = require('restling');

module.exports = function (config, logger) {
    /**
     * Make the rest function based on the method
     * @param  {string}   method The HTML verb
     * @return {function}        The rest wrapper
     */
    function maker (method) {
        /**
         * Global rest function
         * @param  {string}   path Path to do the request
         * @param  {object}   data Data to pass to the request
         * @return {Function}      Bluebird function
         */
        return function (path, data) {
            var url = config.backend.host + config.backend.path + path;
            logger.info(method.toUpperCase() + ' ' + url);

            var options = {
                headers: {
                    'Accept': '*/*',
                    'User-Agent': 'Restling for node.js'
                }
            };

            if (global.API_TOKEN) {
                options.headers.Authorization = 'Bearer ' + global.API_TOKEN;
            }

            if (data) {
                return rest[method + 'Json'](url, data, options);
            }

            return rest[method](url, options);
        }
    }

    return {
        get: maker('get'),
        post: maker('post'),
        put: maker('put'),
        delete: maker('del')
    };
};
