/////////////////////////////////////////////////////////////////
// Sends a mail to the user with a token to validates his mail //
/////////////////////////////////////////////////////////////////

var validator = require('validator');

module.exports = function (db, config) {
    return function (req, res) {
        var eventId = req.params.eventId;
        var mail    = req.params.mail;
        var mailer  = require('../../lib/mailer')(config);

        function generateToken () {
            var token = String.random(5).toUpperCase();

            db.Token.count({
                where: {
                    reset: token
                }
            }).complete(function (err, count) {
                if (err) {
                    return Error.emit(res, 500, '500 - SQL Server error', err.toString());
                }

                if (count === 0) {
                    createTokenAndSendMail(token);
                } else {
                    logger.warn('Needed to regenerate token.');
                    // Token already exists, call again
                    generateToken();
                }
            });
        }

        function createTokenAndSendMail (token) {
            db.Token.create({
                mailCheck: token,
                usermail: mail
            }).complete(function (err, newToken) {
                if (err) {
                    return Error.emit(null, 500, '500 - SQL Server error', err.toString());
                }

                mailer.mailToken(mail, token, function (status) {
                    if (status) {
                        res.status(200).end();
                    } else {
                        res.status(500).end();
                    }
                });
            });
        }

        generateToken();
    };
};
