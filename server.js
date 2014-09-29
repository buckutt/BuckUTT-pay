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

models(function (db) {
    // Custom files
    var makeRoutes = require('./app/routes');

    // Server configuration
    var port = config.port;

    // Gunzip compression
    app.use(compression({
        threshold: 512
    }));

    // POST data parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Static content (will be nginx)
    app.use(express.static(__dirname + '/app/static'));

    // Router API
    var router = express.Router();
    makeRoutes(router, db);
    app.use('/api', router);

    app.use('*', function (req, res) {
        res.status(404).json({
            status: 404,
            error: '404 - Not Found'
        });
        res.end();
    });

    app.listen(port);
    log.info('Listenning on port : ' + config.port);
});
