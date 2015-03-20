///////////////////
// Main app file //
///////////////////

'use strict';

var path        = require('path');
var colors      = require('colors');
var express     = require('express');
var bodyParser  = require('body-parser');
var compression = require('compression');
var Promise     = require('bluebird');
var helmet      = require('helmet');
var cluster     = require('cluster');
var prompt      = Promise.promisifyAll(require('prompt'));
var config      = require('./app/config.json');
var bcrypt      = require('bcryptjs');
var log         = require('./app/lib/log')(config);
var rest        = require('./app/lib/rest')(config, log);
var models      = require('./app/models')(config);
var app         = express();

require('./app/lib/utils.js');
require('./app/lib/errors.js')(config, log);

if (cluster.isMaster) {
    require('./master');
    return;
}

var passwordFromSighup = false;

process.on('message', function (msg) {
    if (msg !== false) {
        passwordFromSighup = msg;
    }
    start();
});

log.info('BuckUTT Pay server');

/* Override config with environment variables */
if (process.env.DB_PORT_3306_TCP_ADDR) {
    config.db.host = process.env.DB_PORT_3306_TCP_ADDR;
}

if (process.env.BACKEND_PORT) {
    config.backend.host = process.env.BACKEND_PORT.replace('tcp', 'http');
}

function start () {
    var basePromise = new Promise(function (resolve, reject) {
        resolve({
            password: passwordFromSighup
        });
    });

    if (!passwordFromSighup) {
        prompt.start();
        basePromise = prompt.getAsync([ { name: 'password', hidden: true }])
    }

    basePromise.then(function (password) {
        process.send(password.password);
        return rest.post('services/login', {
            UserId: 1,
            password: password.password
        });
    })
    .then(function (loginRes) {
        global.API_TOKEN = loginRes.data.token;
    })
    .then(function () {
        models(function (db) {
            // Custom files
            var makeRoutes = require('./app/routes');

            // Server configuration
            var port = config.port;

            /* Some basic protections */
            
            // Serves a strict crossdomain.xml
            app.use(helmet.crossdomain());
            
            // Sets Cross-Site Policy
            app.use(helmet.csp({
                defaultSrc: ["'none'"], // JavaScript, Images, CSS, Font's, AJAX requests, Frames, HTML5 Media : no default source
                scriptSrc:  ["'self' 'unsafe-eval'"], // JavaScript source + eval (angular)
                styleSrc:   ["'self' 'unsafe-inline'"], // CSS source + inline inline css
                imgSrc:     ["'self'"], // Images source
                connectSrc: ["'self'"], // AJAX requests source
                fontSrc:    ["'self'"], // Font's source
                objectSrc:  [],         // Objects sources
                mediaSrc:   [],         // HTML5 audio's and video's source
                frameSrc:   [],         // Frames sources (should be set when sherlocks is ready)
                reportUri:  '/services/report', // Report to this URL if the browser blocks a request because of CSP
                reportOnly: false       // Do not only reports, blocks the request
            }));
            
            // Disables X-Powered-By
            app.use(helmet.hidePoweredBy());

            // Sets X-Download-Options to noopen for IE.
            // See: http://blogs.msdn.com/b/ie/archive/2008/07/02/ie8-security-part-v-comprehensive-protection.aspx
            app.use(helmet.ieNoOpen());

            // Do not executes different mime types
            app.use(helmet.noSniff());

            // Disables frames (clickjacking)
            // TODO : app.use(helmet.frameguard('allow-from', 'sherlocksURL'));
            app.use(helmet.frameguard('deny'));

            // Sets X-XSS-Protection to 1
            app.use(helmet.xssFilter());

            // Gunzip compression
            app.use(compression({
                threshold: 512
            }));

            // POST data parser
            var urlencodedParser = bodyParser.urlencoded({ extended: true });
            var jsonParser       = bodyParser.json();

            // Raw body (csp request body is not working with bodyParser)
            var rowParser = function (req, res, next) {
                req.rawBody = '';

                req.on('data', function (chunk) { 
                    req.rawBody += chunk;
                });

                req.on('end', function () {
                    next();
                });
            };

            // Static content (will be nginx)
            app.use(express.static(__dirname + '/app/public'));

            // Router API
            var router         = express.Router();
            var servicesRouter = express.Router();
            makeRoutes(router, servicesRouter, db, config);
            app.use('/api', urlencodedParser, jsonParser, router);
            app.use('/services', rowParser, servicesRouter);

            app.use(function (req, res) {
                log.warn('404 on ' + req.originalUrl + ' (XHR : ' + req.xhr + ')');
                if (!req.xhr) {
                    log.warn('404 on ' + req.originalUrl + ' (XHR : ' + req.xhr + ')');
                    res.status(404).sendFile(path.resolve('./app/public/404.html'), {}, function () {
                        res.end();
                    });
                } else {
                    Error.emit(res, 404, '404 - Not Found', req.originalUrl);
                }
            });

            app.listen(port);
            log.info('Listenning on port : ' + config.port);
        });
    })
    .catch(function (err) {
        throw err;
    });
}
