///////////////////////
// Back-end REST API //
///////////////////////

'use strict';

var rest = require('restling');

module.exports = function (config, logger) {

    /**
     * Global rest function
     * @param  {string}   path Path to do the request
     * @param  {object}   data Data to pass to the request
     * @return {function}      Bluebird function
     */
    function maker (path, data) {
        var method = this;

        var url = config.backend.host + config.backend.path + path;
        logger.info(method.toUpperCase() + ' ' + url);

        if (data) {
            return rest[method + 'Json'](url, data);
        }

        return rest[method](url);
    }

    return {
        get: maker.bind('get'),
        post: maker.bind('post'),
        put: maker.bind('put'),
        delete: maker.bind('del')
    };
};
