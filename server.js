///////////////////
// Main app file //
///////////////////

'use strict';

var path        = require('path');
var colors      = require('colors');
var express     = require('express');
var bodyParser  = require('body-parser');
var compression = require('compression');
var config      = require('./app/config.json');
var log         = require('./app/lib/log')(config);
var rest        = require('./app/lib/rest')(config, log);
var models      = require('./app/models')(config);
var app         = express();

require('./app/lib/utils.js');
require('./app/lib/errors.js')(config, log);

log.info('BuckUTT Pay server');

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

    app.use(function (req, res) {
        if (!req.xhr) {
            res.sendFile(path.resolve('./app/public/404.html'), {}, function () {
                res.status(404).end();
            });
        } else {
            Error.emit(res, 404, '404 - Not Found', req.originalUrl);
        }
    });

    app.listen(port);
    log.info('Listenning on port : ' + config.port);
});
