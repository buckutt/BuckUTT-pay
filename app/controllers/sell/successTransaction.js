//////////////////////////////////////
// User buys one ticket for himself //
//////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger          = require('../../lib/log')(config);
    var rest            = require('../../lib/rest')(config, logger);

    return function (req, res, next) {
        db.Token.find({
            sherlocksToken: req.params.token
        }).then(function (token) {
            return new Promise(function (resolve, reject) {
                if (!token) {
                    return reject(res.redirect('/#/ticketBought'));
                }

                token.destroy();
                resolve(token.ticket);
            });
        }).then(function (ticketId) {
            return db.Ticket.find(ticketId);
        }).then(function (ticket) {
            ticket.paid = true;
            ticket.paid_at = new Date();
            return ticket.save();
        }).then(function (ticket) {
            logger.info('Paid with sherlocks');
            if (ticket.username !== 0) {
                res.locals.forcedUsername = ticket.username;
                res.locals.shouldNotCheckPassword = true;
                return next();
            }

            console.log('FROM HERE X');
            res.redirect('/#/ticketBought');
        }).catch(function (err) {
            console.dir(err);
        });
    };
};