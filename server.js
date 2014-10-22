// Pay - server.js

// Main app file

'use strict';

var colors      = require('colors');
var express     = require('express');
var bodyParser  = require('body-parser');
var compression = require('compression');
var config      = require('./app/config.json');
var log         = require('./app/log.js')(config);
var models      = require('./app/models')(config);
var app         = express();

log.info('BuckUTT Pay server');

// JS Date -> MySQL DateTime
Date.prototype.toDateTime = function () {
    return this.toISOString().slice(0, 19).replace('T', ' ');
};

// DRY error module
Error.emit = function (res, status, msg, additionnalLog) {
    var msgCodes = {
        '500 - Etu server is not responding': 1,
        '400 - Bad Request'                 : 2,
        '500 - SQL Server error'            : 3,
        '400 - Not enough scopes'           : 4,
        '400 - Duplicate event'             : 7,
        '500 - Cannot write file'           : 8,
        '500 - Invalid token'               : 10
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

// Extends Number to check if a string is a positive number
Number.isPositiveNumeric = function (str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};

models(function (db) {
    // Custom files
    var makeRoutes = require('./app/routes');

    // Server configuration
    var port = config.port;

    // Gunzip compression, if nginx is off
    if (config.debug) {
        app.use(compression({
            threshold: 512
        }));
    }

    // POST data parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Static content (will be nginx)
    app.use(express.static(__dirname + '/app/public'));

    // Router API
    var router = express.Router();
    makeRoutes(router, db, config);
    app.use('/api', router);

    app.use('*', function (req, res) {
        Error.emit(res, 404, '404 - Not Found', req.path);
    });

    app.listen(port);
    log.info('Listenning on port : ' + config.port);
});
