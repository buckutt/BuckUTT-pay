//////////////////////////////////////
// User buys one ticket for himself //
//////////////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res, next) {
        var credit = req.body.amount;
        var username;

        db.Token.find({
            sherlocksToken: req.body.data
        }).then(function (token) {
            return new Promise(function (resolve, reject) {
                if (!token) {
                    return reject('no token to reload');
                }

                token.destroy();
                resolve(token.usermail);
            });
        }).then(function (mail) {
            return rest.get('users?mail=' + mail);
        }).then(function (uRes) {
            var user = uRes.data.data;
            username = user.id;
            return rest.post('services/reload', {
                BuyerId: user.id,
                OperatorId: user.id,
                PointId: 1,
                ReloadTypeId: 3,
                credit: parseInt(credit, 10)
            });
        }).then(function () {
            logger.info('Reloaded with sherlocks');

            res.locals.forcedUsername = username;
            res.locals.shouldNotCheckPassword = true;
            return next();
        }).catch(function (err) {
            console.dir(err);
            Error.emit(res, 500, '500 - Server error', err);
        });
    };
};