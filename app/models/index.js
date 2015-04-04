/////////////////////////////
// Models regroupment file //
/////////////////////////////

'use strict';

var path      = require('path');
var Sequelize = require('sequelize');
var log       = require('../lib/log');
var models    = [
    './account.js',
    './event.js',
    './price.js',
    './right.js',
    './schoolDomain.js',
    './ticket.js',
    './token.js'
];

/**
 * Handles the models
 * @param  {object}   config The app config
 * @return {Function}        A function that can handles gracefully a callback
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
        db.Right.hasOne(db.Account);

        db.Event.hasMany(db.Price);
        db.Event.hasMany(db.Account);

        db.Price.hasOne(db.Ticket);
        db.Event.hasOne(db.Ticket);

        // Retro associations
        db.Account.belongsTo(db.Right);
        db.Account.belongsTo(db.Event);

        db.Price.belongsTo(db.Event);

        db.Ticket.belongsTo(db.Price);
        db.Ticket.belongsTo(db.Event);

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        // If debug mode is enabled, reset the database
        var syncOptions = {};
        if (config.override) {
            syncOptions.force = true;
        }

        db.sequelize
            .sync(syncOptions)
            .complete(function (err) {
                if (err) {
                    return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                // Database seeding
                if (config.override) {
                    require('./seed')(db);
                }

                callback(db);
            });
    };
};
