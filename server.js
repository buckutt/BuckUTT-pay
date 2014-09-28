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

models(function () {
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
    makeRoutes(router);
    app.use('/api', router);

    app.listen(port);
    log.info('BuckUTT Pay server');
    log.info('Listenning on port : ' + config.port);
});
