/////////////////////////////////////////////////////////////////
// Sends a mail to the user with a token to validates his mail //
/////////////////////////////////////////////////////////////////

'use strict';

module.exports = function (db, config) {
    var logger = require('../../lib/log')(config);

    return function (req, res) {
        var mail    = req.params.mail;
        var mailer  = require('../../lib/mailer')(config);

        function generateToken () {
            var token = String.random(5).toUpperCase();

            db.Token
                .count({
                    where: {
                        reset: token
                    }
                })
                .then(function (count) {
                    if (count === 0) {
                        createTokenAndSendMail(token);
                    } else {
                        logger.warn('Needed to regenerate token.');
                        // Token already exists, call again
                        generateToken();
                    }
                })
                .catch(function (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err);
                });
        }

        function createTokenAndSendMail (token) {
            db.Token
                .create({
                    mailCheck: token,
                    usermail: mail
                })
                .then(function () {
                    mailer.mailToken(mail, token, function (status) {
                        if (status) {
                            return res
                                    .status(200)
                                    .end();
                        } else {
                            return res
                                    .status(500)
                                    .end();
                        }
                    });
                })
                .catch(function (err) {
                    return Error.emit(null, 500, '500 - SQL Server error', err);
                });
        }

        generateToken();
    };
};
