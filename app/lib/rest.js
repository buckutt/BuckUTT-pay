///////////////////////
// Back-end REST API //
///////////////////////

'use strict';

var rest = require('restler');

module.exports = function (config, logger) {

    /**
     * Global rest function
     * @param  {string} path Path to do the request
     * @param  {object} data Data to pass to the request
     * @return {object}      Promise-style functions (success, error)
     */
    function maker (path, data) {
        var method = this;

        var url = config.backend.host + config.backend.path + path;
        logger.info(method.toUpperCase() + ' ' + url);

        var callbackSuccess = function () {};
        var callbackError = function () {};

        var conn;
        if (data) {
            conn = rest[method + 'Json'](url, data);
        } else {
            conn = rest[method](url);
        }

        conn.on('success', function (data, res) {
            callbackSuccess(data.data, res);
        }).on('fail', function (data, res) {
            logger.error('Error');
            callbackError(data, res);
        }).on('error', function (data, res) {
            logger.error('Error');
            callbackError(data, res);
        }).on('timeout', function (data, res) {
            logger.error('Error');
            callbackError(data, res);
        });

        var promise = {
            success: function (c) {
                callbackSuccess = c;
                return promise;
            },
            error: function (c) {
                callbackError = c;
                return promise;
            }
        };

        return promise;
    }

    return {
        get: maker.bind('get'),
        post: maker.bind('post'),
        put: maker.bind('put'),
        delete: maker.bind('delete')
    };
};
