// Pay - app/lib/error.js

// Error function to out json error to browser

'use strict';

module.exports =  function (config, log) {

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
            '400 - Invalid username/password' : 4,
            '400 - Duplicate event'           : 7,
            '500 - Cannot write file'         : 8,
            '500 - Invalid token'             : 10,
            '500 - Cannot write config file'  : 13,
            '401 - Unauthorized'              : 14
        };

        log.error(msg);
        if (config.debug && additionnalLog) {
            log.error(additionnalLog);
        }

        if (msgCodes.hasOwnProperty(msg)) {
            msg = msgCodes[msg];
        } else {
            msg = 0;
        }

        if (res) {
            res.status(status).json({
                status: status,
                error: msg
            });
        } else {
            process.exit(1);
        }
    };
};
