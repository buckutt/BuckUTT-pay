/////////////////////////////////////////
// Do the CORS request to the back-end //
// Or refresh the token                //
/////////////////////////////////////////

'use strict';

var crypto  = require('crypto');
var request = require('request');
var bcrypt  = require('bcryptjs');

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res, next) {
        if (!req.form.isValid) {
            Error.emit(res, 400, '400 - Bad Request', req.form.errors);
            return;
        }

        var username = req.form.username;
        var password = req.form.password;
        var hash = bcrypt.hashSync(password);
        var sha512 = crypto.createHash('sha512');
        sha512.update(username + ':' + password);
        var token = sha512.digest('hex');

        logger.info('Asking axel back end with : ' + username + '/' + password);
        if (bcrypt.compareSync(req.form.password, hash)) {
            req.user = {
                id: 1,
                username: username,
                isAdmin: false,
                fundations: [
                    {
                        id: 1,
                        name: 'BDE',
                        isInBoard: true
                    },
                    {
                        id: 2,
                        name: 'UNG',
                        isInBoard: false
                    }
                ],
                tickets: [
                    {
                        id: 1,
                        username: 35342,
                        student: true,
                        contributor: true,
                        paid: true,
                        paid_at: new Date(),
                        paid_with: 'buckutt',
                        event_id: 1,
                        price_id: 1,
                        mean_of_payment_id: 1
                    }
                ],
                token: token
            };
            next();
        } else {
            Error.emit(res, 400, '400 - Invalid username/password');
            return;
        }
    };
};
