////////////////
// Log helper //
////////////////

'use strict';

var fs = require('fs');

/**
  * Ensures that the numeric is two-characters long
  * Else adds a trailing 0
  * @param {int} num - The number
  * @return {string} The padded number
  */
function pad2 (num) {
    num = parseInt(num, 10);
    return (num < 10) ? '0' + num : '' + num;
}

/**
  * Logs a formatted text message
  * this.outTo : where to out the message (console or filepath)
  * this.minLevel : the minimum level to output (0, 1, 2, 3)
  */
function Log () {
    this.outTo = null;
    this.minLevel = null;
    this.format = null;

    var levels = {
        'debug': 0,
        'info': 1,
        'warn': 2,
        'err': 3
    };

    var levelColor = {
        'debug': 'green',
        'info': 'blue',
        'warn': 'yellow',
        'err': 'red'
    };

    /**
      * Generic write. Writes to console or to file, depending on outTo
      * @param {string} lvl - The message level
      * @param {string} msg - The log message
      */
    this.write = function (lvl, msg) {
        // If the log message does not have enough level, stops
        if (levels[lvl] < this.minLevel) {
            return;
        }

        var formattedMsg = this.format;
        var date = new Date();
        var formattedDate =
            date.getFullYear() + '/' +
            pad2(date.getMonth() + 1) + '/' +
            pad2(date.getDate()) + ' - ' +
            pad2(date.getHours()) + ':' +
            pad2(date.getMinutes()) + ':' +
            pad2(date.getSeconds());

        // Message outs to console
        if (this.outTo === 'console') {
            formattedMsg = formattedMsg.replace('%s', msg);
            formattedMsg = formattedMsg.replace('%d', formattedDate.bold);
            formattedMsg = formattedMsg.replace('%l', ('[' + lvl + ']').bold);
            formattedMsg = formattedMsg[levelColor[lvl]];
            console.log(formattedMsg);
            return;
        }

        // Message outs to file
        formattedMsg = formattedMsg.replace('%s', msg);
        formattedMsg = formattedMsg.replace('%d', formattedDate);
        formattedMsg = formattedMsg.replace('%l', '[' + lvl + ']');
        fs.writeFileSync(this.outTo, formattedMsg);
    };

    /**
      * Debug message
      * @param {string} msg - The message to log
      */
    this.debug = function (msg) {
        this.write('debug', msg);
    };

    /**
      * Info message
      * @param {string} msg - The message to log
      */
    this.info = function (msg) {
        this.write('info', msg);
    };

    /**
      * Warning message
      * @param {string} msg - The message to log
      */
    this.warn = function (msg) {
        this.write('warn', msg);
    };

    /**
      * Error message
      * @param {string} msg - The message to log
      */
    this.error = function (msg) {
        this.write('err', msg);
    };
};

var log = new Log();

module.exports = function (config) {
    log.outTo = config.log.out;
    log.format = config.log.format;
    log.minLevel = config.log.level;

    if (config.log.log) {
        return log;
    }

    return function () {};
};
