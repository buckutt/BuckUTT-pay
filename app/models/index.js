// Pay - /models/index.js

// Models regroupment file

'use strict';

var Sequelize = require('sequelize');
var log       = require('../log');
var files     = [
    './ticket'
];

/**
  * Handles the models
  * @param  {object}   config - The app config
  * @return {function} A function that can handles gracefully a callback
  */
module.exports = function (config) {
    log = log(config);

    return function (callback) {
        var sequelize = new Sequelize(config.db.name, config.db.user, config.db.pwd, {
            host: config.db.host,
            port: config.db.port,
            database: config.db.pwd,
            logging: function (t) {
                log.debug(t);
            }
        });
        var db = {};

        sequelize
            .authenticate()
            .complete(function (err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }

                callback();
            });
    };
};
