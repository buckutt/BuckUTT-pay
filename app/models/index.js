// Pay - /app/models/index.js

// Models regroupment file

'use strict';

var path      = require('path');
var Sequelize = require('sequelize');
var log       = require('../log');
var models    = [
    './account.js',
    './association.js',
    './event.js',
    './meanOfPayment.js',
    './price.js',
    './right.js',
    './schoolDomain.js',
    './ticket.js',
    './token.js'
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
            logging: function (t) {
                log.debug(t);
            }
        });

        var db = {};

        models.forEach(function (modelFile) {
            var model = sequelize.import(path.join(__dirname, modelFile));
            db[model.name] = model;
        });

        // Associations
        db.Right        .hasOne(db.Account);
        db.Association  .hasOne(db.Account);
        db.Event        .hasOne(db.Price);
        db.Association  .hasOne(db.Ticket);
        db.Price        .hasOne(db.Ticket);
        db.Event        .hasOne(db.Ticket);
        db.MeanOfPayment.hasOne(db.Ticket);

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        // If debug mode is enabled, reset the database
        var syncOptions = {};
        if (config.debug) {
            syncOptions.force = true;
        }

        db.sequelize
            .sync(syncOptions)
            .complete(function (err) {
                if (err) {
                    Error.emit(null, 500, '500 - SQL Server error ' + err.toString());
                    process.exit(1);
                }

                // Database seeding
                if (config.debug) {
                    require('./seed')(db);
                }

                callback(db);
            });
    };
};
