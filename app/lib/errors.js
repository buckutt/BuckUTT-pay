/////////////////////////////////////////////////
// Error function to out json error to browser //
/////////////////////////////////////////////////

'use strict';

var path = require('path');

module.exports = function (config, log) {

    /**
     * Emit an error to the browser
     * @param  {object} The express res object
     * @param  {number} The status code
     * @param  {string} The exit message
     * @param  {string} Additionnal log to be out on the logger
     */
    Error.emit = function (res, status, msg, additionnalLog) {
        var msgCodes = {
            '404 - Not Found'                 : 1,
            '400 - Bad Request'               : 2,
            '500 - SQL Server error'          : 3,
            '401 - Invalid username/password' : 4,
            '400 - Duplicate event'           : 7,
            '500 - Cannot write file'         : 8,
            '500 - Invalid token'             : 10,
            '500 - Cannot write config file'  : 13,
            '401 - Unauthorized'              : 14,
            '500 - Buckutt server error'      : 17,
            '500 - Could\'t send mail'        : 18,
            '402 - Refused payement'          : 19
        };

        log.error(msg);
        if (config.debug && additionnalLog) {
            console.dir(additionnalLog);
        }

        if (msgCodes.hasOwnProperty(msg)) {
            msg = msgCodes[msg];
        } else {
            msg = 0;
        }

        if (res) {
            if (!res.req.xhr) {
                log.warn(status + ' on ' + res.req.originalUrl + ' (XHR : ' + res.req.xhr + ')');
                if (status === 404) {
                    return res
                            .redirect('/404/html');
                } else {
                    return res
                            .redirect('/error.html#' + status);
                }
            } else {
                return res
                        .status(status)
                        .json({
                            error: msg
                        });
            }
        } else {
            process.exit(1);
        }
    };
};
