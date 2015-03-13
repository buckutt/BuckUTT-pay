//////////////////////////////////////////////////////
// Send an e-mail with a password resiliation token //
//////////////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);
    var rest   = require('../../lib/rest')(config, logger);

    return function (req, res) {
        var mailer = require('../../lib/mailer')(config);

        /**
         * Step 1 - Checks if email exists
         */
        rest.get('users?mail=' + req.params.mail).then(function (uRes) {
            var data = uRes.data.data;
            if (!data) {
                return Error.emit(res, 401, '401 - Unauthorized', 'Mail not found');
            }

            generateToken();
        }, function () {
            Error.emit(res, 500, '500 - Buckutt server error', 'Mail fail');
        });

        /**
         * Step 2 - Generates random token
         */
        function generateToken () {
            var token = String.random(20);

            db.Token.count({
                where: {
                    reset: token
                }
            }).complete(function (err, count) {
                if (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err.toString());
                }

                if (count === 0) {
                    createToken(token);
                } else {
                    logger.warn('Needed to regenerate token.');
                    // Token already exists, call again
                    generateToken();
                }
            });
        }

        /**
         * Step 3 - Creates the token
         * @param  {string} token The token to create
         */
        function createToken (token) {
            db.Token.create({
                reset: token,
                usermail: req.params.mail
            }).complete(function (err, newToken) {
                if (err) {
                    return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                sendMail(token);
            });
        }

        /**
         * Step 4 - Sends the mail to the user
         * @param  {string} token The token to send
         */
        function sendMail (token) {
            mailer.reset(req.params.mail, 'http://localhost:8080/#/reset/' + token, function (okay) {
                if (!okay) {
                    return Error.emit(res, 500, '500 - Could\'t send mail');
                }

                res.json({
                    status: 200
                });
            });
        }
    };
};
