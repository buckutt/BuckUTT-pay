////////////////////////////
// Main reload controller //
////////////////////////////

'use strict';

var Promise = require('bluebird');

module.exports = function (db, config) {
    return function (req, res) {
        var id;
        var token;

        restling.post(config.sherlocks.host + 'pay/' + (req.query.amount * 100), {
            data: req.user.mail,
            service: config.sherlocks.reloadId
        })
        .then(function (sherlocksRes) {
            id = sherlocksRes.data.id;
            token = sherlocksRes.data.token;

            return new Promise(function (resolve, reject) {
                db.Token.create({
                    usermail: req.user.mail,
                    sherlocksToken: token
                }).complete(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(sherlocksRes);
                });
            });
        })
        .then(function (sherlocksRes) {
            res.redirect(config.sherlocks.host + 'initiate/' + id);
        });
    };
};